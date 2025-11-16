"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "حدث خطأ");
      return;
    }

    setSuccess("تم إنشاء الحساب بنجاح!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">إنشاء حساب</h1>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded text-center">{error}</p>
        )}

        {success && (
          <p className="bg-green-100 text-green-600 p-2 rounded text-center">
            {success}
          </p>
        )}

        <input
          name="name"
          placeholder="الاسم"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="email"
          type="email"
          placeholder="البريد الإلكتروني"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="phone"
          placeholder="رقم الهاتف"
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
          إنشاء حساب
        </button>
      </form>
    </div>
  );
}
