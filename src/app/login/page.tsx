"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "بيانات غير صحيحة");
      return;
    }

    router.push("/profile");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">تسجيل الدخول</h1>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded text-center">{error}</p>
        )}

        <input
          name="email"
          type="email"
          placeholder="البريد الإلكتروني"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="كلمة المرور"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          دخول
        </button>
      </form>
    </div>
  );
}
