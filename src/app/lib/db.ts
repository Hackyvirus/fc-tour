import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  password: "591081",
  host: "localhost",
  port: 5432,
  database: "evertour"
});
