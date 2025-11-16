"use client";

import { useState } from "react";

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const search = async (e: any) => {
    e.preventDefault();
    setError("");
    setData(null);

    const res = await fetch("/api/booking/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingCode: code }),
    });

    const dataRes = await res.json();

    if (!res.ok) {
      setError(dataRes.error);
      return;
    }

    setData(dataRes.booking);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100">

      <div className="bg-white shadow-2xl p-8 rounded-3xl w-full max-w-xl border border-gray-200 animate-fadeIn">

        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-2 tracking-tight">
          متابعة الحجز
        </h1>

        <p className="text-gray-600 text-center -mt-1 mb-6">
          أدخل كود المتابعة لمعرفة حالة الحجز بالتفصيل
        </p>

        {/* FORM */}
        <form onSubmit={search} className="space-y-4">

          <input
            placeholder="ادخل كود المتابعة"
            className="w-full p-4 text-lg border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-600 outline-none"
            onChange={(e) => setCode(e.target.value)}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white p-3 rounded-xl font-bold text-lg shadow">
            بحث
          </button>
        </form>

        {error && (
          <p className="text-red-600 mt-4 text-center font-semibold bg-red-100 p-2 rounded-lg">
            {error}
          </p>
        )}

        {data && (
          <div className="mt-8 space-y-3 bg-gray-50 p-6 rounded-2xl border shadow-inner animate-slideUp">

            <p className="text-center text-blue-700 font-extrabold text-2xl mb-4">
              تفاصيل الحجز
            </p>

            <p><span className="font-bold text-gray-700">الاسم:</span> {data.name}</p>
            <p><span className="font-bold text-gray-700">السن:</span> {data.age}</p>
            <p><span className="font-bold text-gray-700">الهاتف:</span> {data.phone}</p>

            <p>
              <span className="font-bold text-gray-700">نوع الحجز:</span>{" "}
              {data.type === "clinic" ? "عيادة" : "استفسار سريع"}
            </p>

            <p>
              <span className="font-bold text-gray-700">السعر:</span>{" "}
              <span className="text-green-700 font-bold">{data.price} جنيه</span>
            </p>

            <p><span className="font-bold text-gray-700">اليوم:</span> {data.day}</p>
            <p><span className="font-bold text-gray-700">التاريخ:</span> {data.date}</p>
            <p><span className="font-bold text-gray-700">الساعة:</span> {data.time}</p>

            <p>
              <span className="font-bold text-gray-700">الحالة:</span>{" "}
              <span
                className={
                  data.status === "pending"
                    ? "text-yellow-600 font-bold"
                    : data.status === "confirmed"
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {data.status === "pending"
                  ? "قيد الانتظار"
                  : data.status === "confirmed"
                  ? "تم التأكيد"
                  : "ملغي"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
