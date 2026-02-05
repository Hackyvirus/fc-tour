import { pool } from "../../../../lib/db";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const hash = await bcrypt.hash(password, 10);

    const userRes = await pool.query(
      "INSERT INTO users (email, password_hash,role) VALUES ($1, $2,$3) RETURNING id",
      [email, hash,'user']
    );

    const userId = userRes.rows[0].id;

    // create session immediately
    const sessionId = uuid();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await pool.query(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1,$2,$3)",
      [sessionId, userId, expires]
    );

    (await cookies()).set("session_id", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      expires
    });

    return Response.json({ success: true });
  } catch (err: any) {
    console.error(err.message);
    return Response.json({ error: err.message }, { status: 400 });
  }
}
