"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!res.ok) {
        router.push("/login");
        return;
      }

      setUser(data);
      setForm({
        name: data.name,
        phone: data.phone,
        email: data.email,
      });
      setLoading(false);
    };

    load();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async (e: any) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    const res = await fetch("/api/auth/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErr(data.error);
      return;
    }

    setMsg("تم تحديث بياناتك بنجاح ✔");
    setTimeout(() => router.push("/profile"), 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form className="bg-white p-6 shadow rounded w-full max-w-md space-y-4" onSubmit={save}>
        <h1 className="text-xl font-bold mb-2">تعديل البروفايل</h1>

        {msg && <p className="bg-green-100 text-green-700 p-2 rounded text-center">{msg}</p>}
        {err && <p className="bg-red-100 text-red-700 p-2 rounded text-center">{err}</p>}

        <input
          name="name"
          onChange={handleChange}
          value={form.name}
          className="w-full p-2 border rounded"
          placeholder="الاسم"
        />

        <input
          name="phone"
          onChange={handleChange}
          value={form.phone}
          className="w-full p-2 border rounded"
          placeholder="رقم الهاتف"
        />

        <input
          name="email"
          onChange={handleChange}
          value={form.email}
          className="w-full p-2 border rounded"
          placeholder="البريد الإلكتروني"
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}
