import { pool } from "../../../lib/db";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const userRes = await pool.query(
    "SELECT * FROM users WHERE email=$1 and role='admin'",
    [email]
  );

  if (userRes.rows.length === 0)
    return Response.json({ error: "Invalid" }, { status: 401 });

  const user = userRes.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid)
    return Response.json({ error: "Invalid" }, { status: 401 });

  const sessionId = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await pool.query(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1,$2,$3)",
    [sessionId, user.id, expires]
  );

  (await cookies()).set("session_id", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    expires
  });

  return Response.json({ success: true });
}
