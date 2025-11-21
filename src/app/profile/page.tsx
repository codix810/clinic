"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Get user info
      const me = await fetch("/api/auth/me");
      const userRes = await me.json();

      if (!me.ok) {
        router.push("/login");
        return;
      }

      setUser(userRes);

      // Get bookings
      const b = await fetch("/api/booking/my");
      const bookRes = await b.json();
      if (b.ok) setBookings(bookRes);

      // Get quick queries
      const q = await fetch("/api/quick/my");
      const quickRes = await q.json();
      if (q.ok) setQueries(quickRes);

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 via-white to-green-100">

      <div className="max-w-4xl mx-auto space-y-8">

        {/* USER CARD */}
        <div className="bg-white shadow-xl p-8 rounded-3xl border border-gray-200">
          <h1 className="text-3xl font-extrabold mb-4 text-blue-700">الملف الشخصي</h1>

          <div className="space-y-2 text-lg">
            <p><b>الاسم:</b> {user.name}</p>
            <p><b>الإيميل:</b> {user.email}</p>
            <p><b>الهاتف:</b> {user.phone}</p>
            <p><b>الدور:</b> مريض</p>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => router.push("/profile/edit")}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow"
            >
              تعديل البيانات
            </button>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/";
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* BOOKINGS */}
        <div className="bg-white shadow-xl p-8 rounded-3xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">الحجوزات</h2>

          {bookings.length === 0 ? (
            <p className="text-gray-500">لا يوجد حجوزات</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div key={b._id} className="p-4 rounded-xl border bg-gray-50 shadow-sm">

                  <p><b>كود:</b> {b.trackingCode}</p>
                  <p><b>النوع:</b> {b.type === "clinic" ? "عيادة" : "استفسار"}</p>
                  <p><b>اليوم:</b> {b.day}</p>
                  <p><b>التاريخ:</b> {b.date}</p>
                  <p><b>الساعة:</b> {b.time}</p>
                  <p><b>الحالة:</b> {b.status}</p>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK QUERIES */}
        <div className="bg-white shadow-xl p-8 rounded-3xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-green-700">الاستفسارات السريعة</h2>

          {queries.length === 0 ? (
            <p className="text-gray-500">لا يوجد استفسارات</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {queries.map((q) => (
                <div key={q._id} className="p-4 rounded-xl border bg-gray-50 shadow-sm">
                  
                  <p><b>كود:</b> {q.trackingCode}</p>
                  <p><b>الأعراض:</b> {q.symptoms.slice(0, 50)}...</p>

                  <p>
                    <b>الحالة:</b>{" "}
                    <span
                      className={
                        q.status === "pending"
                          ? "text-yellow-600 font-bold"
                          : q.status === "replied"
                          ? "text-blue-600 font-bold"
                          : "text-gray-500 font-bold"
                      }
                    >
                      {q.status === "pending"
                        ? "قيد الانتظار"
                        : q.status === "replied"
                        ? "تم الرد"
                        : "مغلق"}
                    </span>
                  </p>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
