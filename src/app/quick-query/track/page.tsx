"use client";

import { useState } from "react";

export default function TrackQuickQuery() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const search = async (e: any) => {
    e.preventDefault();
    setError("");
    setData(null);

    const res = await fetch("/api/quick/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingCode: code }),
    });

    const dataRes = await res.json();

    if (!res.ok) {
      setError(dataRes.error);
      return;
    }

    setData(dataRes.query);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-white to-green-100">

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 animate-fadeIn">
        
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-4">
          متابعة الاستفسار
        </h1>

        <form onSubmit={search} className="space-y-4">
          <input
            placeholder="ادخل كود المتابعة"
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-600 outline-none"
            onChange={(e) => setCode(e.target.value)}
          />

          <button className="w-full bg-green-600 text-white p-3 rounded-xl font-bold text-lg hover:bg-green-700 transition active:scale-95">
            بحث
          </button>
        </form>

        {error && (
          <p className="text-red-600 mt-4 text-center bg-red-100 p-2 rounded-lg font-semibold">
            {error}
          </p>
        )}

        {data && (
          <div className="mt-6 space-y-3 bg-gray-50 p-6 rounded-xl border shadow-inner animate-slideUp">
            <p className="text-center text-green-700 font-extrabold text-xl mb-2">
              تفاصيل الاستفسار
            </p>

            <p><b>الأعراض:</b> {data.symptoms}</p>
            <p><b>السعر:</b> {data.price} جنيه</p>

            <p>
              <b>الحالة:</b>{" "}
              <span
                className={
                  data.status === "pending"
                    ? "text-yellow-600 font-bold"
                    : data.status === "replied"
                    ? "text-blue-600 font-bold"
                    : "text-gray-500 font-bold"
                }
              >
                {data.status === "pending"
                  ? "قيد الانتظار"
                  : data.status === "replied"
                  ? "تم الرد"
                  : "مغلق"}
              </span>
            </p>

            {data.reply && (
              <div className="mt-4 bg-white border p-4 rounded-xl shadow">
                <p className="font-bold text-green-700 mb-1">رد الطبيب:</p>
                <p className="text-gray-700">{data.reply}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
