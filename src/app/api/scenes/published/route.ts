import { NextRequest } from "next/server";
import { pool } from "../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const scenesResult = await pool.query(`
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
      WHERE published = true
      ORDER BY created_at ASC
    `);

    const scenes = scenesResult.rows.map(scene => ({
      _id: scene._id,
      title: scene.title,
      slug: scene.slug,
      description: scene.description,
      mediaUrl: scene.mediaUrl,
      published: scene.published,
      nextSceneId: scene.nextSceneId,
      createdAt: scene.createdAt,
      coords: {
        lat: parseFloat(scene.latitude) || 0,
        lng: parseFloat(scene.longitude) || 0
      },
      yawPitchFov: {
        yaw: parseInt(scene.yaw) || 0,
        pitch: parseInt(scene.pitch) || 0,
        fov: parseInt(scene.fov) || 75
      }
    }));

    return Response.json(scenes);

  } catch (err: any) {
    console.error("Error fetching published scenes:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
