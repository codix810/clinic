"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuickQueryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    symptoms: "",
  });

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // حماية الصفحة – لازم يكون مسجل دخول
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/login?redirect=quick-query");
        return;
      }

      const data = await res.json();
      setUser(data);
      setLoading(false);
    };

    load();
  }, []);

  const submitQuery = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!user?._id) {
      setError("حدث خطأ — يرجى تسجيل الدخول مرة أخرى");
      return;
    }

    const res = await fetch("/api/quick/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: form.symptoms }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "حدث خطأ أثناء إرسال الاستفسار");
      return;
    }

    router.push(`/quick-query/success?code=${data.trackingCode}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-100 via-white to-blue-100">

      <form
        onSubmit={submitQuery}
        className="bg-white w-full max-w-xl p-8 rounded-3xl shadow-2xl border border-green-100 space-y-6 animate-fadeIn"
      >

        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-2 tracking-tight">
          استفسار سريع
        </h1>

        <p className="text-center text-gray-500 -mt-3">
          اسأل الدكتور مباشرة — وسيتم الرد عليك قريبًا
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center font-semibold">
            {error}
          </p>
        )}

        {/* SYMPTOMS */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            اكتب الأعراض بالتفصيل
          </label>
          <textarea
            name="symptoms"
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none min-h-[150px]"
            placeholder="مثال: عندي صداع مستمر منذ يومين مع دوخة بسيطة..."
            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
          ></textarea>
        </div>

        {/* SUBMIT */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold text-xl transition shadow-md active:scale-95">
          إرسال الاستفسار
        </button>

      </form>
    </div>
  );
}
