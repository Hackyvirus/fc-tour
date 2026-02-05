import { cookies } from "next/headers";
import { pool } from "./db";

export async function getSession() {
  const cookieStore =await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) return null;

  const res = await pool.query(
    `
    SELECT 
      sessions.id,
      sessions.user_id,
      users.email,
      users.role,
      sessions.expires_at
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = $1
      AND sessions.expires_at > NOW()
    `,
    [sessionId]
  );

  return res.rows[0] || null;
}
