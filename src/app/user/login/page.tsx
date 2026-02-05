"use client";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    const res = await fetch("/api/auth/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      window.location.href = "/tour";
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-around p-3 border-2 w-2/4 px-10 py-6">
      <h2 className="text-black text-4xl text-center pb-4">User Login</h2>

      <input
        style={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        className="outline-2 rounded-lg"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        className="outline-2 rounded-lg"
        onChange={e => setPassword(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button style={styles.button} onClick={submit}>
        Login
      </button>

      <p>
        New user?{" "}
        <Link href="/user/register" style={{ color: "blue" }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "100px auto",
    display: "flex",
    flexDirection: "column" as const,
    gap: 12
  },
  input: {
    padding: 10,
    fontSize: 16
  },
  button: {
    padding: 10,
    fontSize: 16,
    cursor: "pointer"
  }
};
