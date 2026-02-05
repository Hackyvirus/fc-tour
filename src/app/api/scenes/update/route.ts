import { NextRequest } from "next/server";
import { pool } from "../../../lib/db";
import { requireAdmin } from "../../../lib/requireAdmin";

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { sceneId, nextSceneId, published } = body;

    if (!sceneId) {
      return Response.json({ error: "Scene ID is required" }, { status: 400 });
    }

    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (nextSceneId !== undefined) {
      updates.push(`next_scene_id = $${paramCount}::uuid`);
      // Handle empty string as null for UUID
      values.push(nextSceneId === '' || nextSceneId === null ? null : nextSceneId);
      paramCount++;
    }

    if (published !== undefined) {
      updates.push(`published = $${paramCount}`);
      values.push(published);
      paramCount++;
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add sceneId as the last parameter
    values.push(sceneId);

    const query = `
      UPDATE scenes
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}::uuid
      RETURNING 
        id::text as "_id",
        title,
        slug,
        description,
        image_url as "mediaUrl",
        published,
        latitude,
        longitude,
        next_scene_id::text as "nextSceneId",
        created_at as "createdAt"
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return Response.json({ error: "Scene not found" }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      scene: result.rows[0] 
    });

  } catch (err: any) {
    console.error("Error updating scene:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}