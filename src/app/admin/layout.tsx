"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      if (data.role !== "admin") {
        router.push("/");
        return;
      }

      setUser(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white shadow-lg border-r p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-extrabold text-blue-600 mb-4 text-center">
          لوحة التحكم
        </h1>

        <nav className="flex flex-col gap-3 text-lg">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="hover:bg-blue-50 p-3 rounded-lg text-right"
          >
            الرئيسية
          </button>

          <button
            onClick={() => router.push("/admin/appointments")}
            className="hover:bg-blue-50 p-3 rounded-lg text-right"
          >
            الحجوزات
          </button>

          <button
            onClick={() => router.push("/admin/queries")}
            className="hover:bg-blue-50 p-3 rounded-lg text-right"
          >
            الاستفسارات
          </button>

          <button
            onClick={() => router.push("/admin/patients")}
            className="hover:bg-blue-50 p-3 rounded-lg text-right"
          >
            المرضى
          </button>

          <button
            onClick={() => router.push("/admin/settings")}
            className="hover:bg-blue-50 p-3 rounded-lg text-right"
          >
            الإعدادات
          </button>

          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/");
            }}
            className="bg-red-500 text-white p-3 rounded-lg mt-4"
          >
            تسجيل الخروج
          </button>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8">{children}</main>

    </div>
  );
}
