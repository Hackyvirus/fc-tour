import { NextRequest } from "next/server";
import { pool } from "../../lib/db";
import cloudinary from "../../lib/cloudinary";
import { requireAdmin } from "../../lib/requireAdmin";

export async function GET() {
  try {
    await requireAdmin();

    const result = await pool.query(`
      SELECT 
        id::text as "_id",
        title,
        slug,
        description,
        image_url as "mediaUrl",
        published,
        latitude,
        longitude,
        yaw,
        pitch,
        fov,
        next_scene_id::text as "nextSceneId",
        created_at as "createdAt"
      FROM scenes
      ORDER BY created_at DESC
    `);

    const scenes = result.rows.map(scene => ({
      ...scene,
      coords: {
        lat: parseFloat(scene.latitude) || 0,
        lng: parseFloat(scene.longitude) || 0
      },
      hotspots: 0, 
      views: 0 
    }));

    return Response.json(scenes);

  } catch (err: any) {
    console.error("Error fetching scenes:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return Response.json({ error: "Image file is required" }, { status: 400 });
    }

    const uploadBuffer = Buffer.from(await file.arrayBuffer());
    const uploadRes: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "scenes" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(uploadBuffer);
    });

    const imageUrl = uploadRes.secure_url;

    const scene = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
      yaw: formData.get("yaw") || 0,
      pitch: formData.get("pitch") || 0,
      fov: formData.get("fov") || 90,
      published: formData.get("published") === "true",
      nextSceneId: formData.get("nextSceneId") || null
    };

    const result = await pool.query(
      `
      INSERT INTO scenes
      (title, slug, description, latitude, longitude, yaw, pitch, fov, image_url, published, created_by, next_scene_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::uuid)
      RETURNING id::text as "_id", title, slug
      `,
      [
        scene.title,
        scene.slug,
        scene.description,
        scene.latitude,
        scene.longitude,
        scene.yaw,
        scene.pitch,
        scene.fov,
        imageUrl,
        scene.published,
        session.user_id,
        scene.nextSceneId
      ]
    );

    const sceneId = result.rows[0]._id;

    const hotspotsJson = formData.get("hotspots");
    if (hotspotsJson) {
      try {
        const hotspots = JSON.parse(hotspotsJson as string);
        
        if (Array.isArray(hotspots) && hotspots.length > 0) {
          for (const hotspot of hotspots) {
            await pool.query(
              `
              INSERT INTO hotspots
              (scene_id, type, label, yaw, pitch, target_scene_id, description, media_url, display_order)
              VALUES ($1::uuid, $2, $3, $4, $5, $6::uuid, $7, $8, $9)
              `,
              [
                sceneId,
                hotspot.type,
                hotspot.label,
                hotspot.yaw,
                hotspot.pitch,
                hotspot.targetSceneId || null,
                hotspot.description || null,
                hotspot.mediaUrl || null,
                hotspots.indexOf(hotspot) + 1
              ]
            );
          }
        }
      } catch (err) {
        console.error('Error parsing/inserting hotspots:', err);
      }
    }

    return Response.json({ 
      success: true,
      scene: result.rows[0]
    });

  } catch (err: any) {
    console.error("Error creating scene:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

