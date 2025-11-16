"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/stats");

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div>

      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">
        مرحبًا بك في لوحة التحكم
      </h1>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow border text-center">
          <h2 className="text-gray-500">حجوزات اليوم</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {stats.todayBookings}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border text-center">
          <h2 className="text-gray-500">استفسارات اليوم</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {stats.todayQueries}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border text-center">
          <h2 className="text-gray-500">إجمالي الدخل اليوم</h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">
            {stats.todayRevenue} جنيه
          </p>
        </div>

      </div>

      {/* NEW SECTION */}
      <div className="mt-10 grid lg:grid-cols-2 gap-6">

        {/* UPCOMING APPOINTMENTS */}
        <div className="bg-white p-6 shadow rounded-2xl border">
          <h2 className="text-xl font-bold mb-4 text-blue-700">
            حجوزات قيد الانتظار
          </h2>

          {stats.pendingAppointments.length === 0 ? (
            <p className="text-gray-500">لا توجد حجوزات معلّقة</p>
          ) : (
            stats.pendingAppointments.map((a: any) => (
              <div
                key={a._id}
                className="border p-4 rounded-xl mb-3 bg-gray-50"
              >
                <p><b>الاسم:</b> {a.name}</p>
                <p><b>النوع:</b> {a.type === "clinic" ? "عيادة" : "استفسار"}</p>
                <p><b>التاريخ:</b> {a.date} — {a.time}</p>
              </div>
            ))
          )}
        </div>

        {/* QUICK QUERIES */}
        <div className="bg-white p-6 shadow rounded-2xl border">
          <h2 className="text-xl font-bold mb-4 text-green-700">
            استفسارات قيد المراجعة
          </h2>

          {stats.pendingQueries.length === 0 ? (
            <p className="text-gray-500">لا توجد استفسارات معلّقة</p>
          ) : (
            stats.pendingQueries.map((q: any) => (
              <div
                key={q._id}
                className="border p-4 rounded-xl mb-3 bg-gray-50"
              >
                <p><b>الكود:</b> {q.trackingCode}</p>
                <p><b>الأعراض:</b> {q.symptoms.slice(0, 60)}...</p>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
