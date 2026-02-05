import { NextRequest } from "next/server";
import { pool } from "../../../lib/db";
import { requireAdmin } from "../../../lib/requireAdmin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const sceneId = params.id;

    if (!sceneId) {
      return Response.json({ error: "Scene ID is required" }, { status: 400 });
    }

    // First, remove any references to this scene as next_scene_id
    await pool.query(
      `UPDATE scenes SET next_scene_id = NULL WHERE next_scene_id = $1::uuid`,
      [sceneId]
    );

    // Delete the scene
    const result = await pool.query(
      `DELETE FROM scenes WHERE id = $1::uuid RETURNING id`,
      [sceneId]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: "Scene not found" }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      message: "Scene deleted successfully" 
    });

  } catch (err: any) {
    console.error("Error deleting scene:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}