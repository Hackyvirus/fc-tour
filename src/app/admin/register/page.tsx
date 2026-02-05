"use client";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email || !password) {
      return "Email and password are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Enter a valid email address";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }

    return null;
  };

  const submit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    setLoading(false);

    if (res.ok) {
      window.location.href = "/admin/login";
    } else {
      const data = await res.json();
      setError(data.error || "User already exists");
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-around p-3 border-2 w-2/4 px-10 py-6">
      <h2 className="text-black text-4xl text-center pb-4">
        Admin Register
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        className="outline-2 rounded-lg p-2"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password (min 8 chars)"
        value={password}
        className="outline-2 rounded-lg p-2"
        onChange={e => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        className="bg-black text-white p-2 rounded disabled:opacity-50"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Account"}
      </button>

      <p>
        Already have an account?{" "}
        <Link href="/admin/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
}
