"use client";

import { useEffect, useState } from "react";

export default function MyBookings() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/booking/my")
      .then((res) => res.json())
      .then((res) => {
        if (res.error) setError(res.error);
        else setData(res);
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">حجوزاتي</h1>

      <div className="space-y-4">
        {data.map((item: any) => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            <p><b>الاسم:</b> {item.name}</p>
            <p><b>نوع الحجز:</b> {item.type === "clinic" ? "عيادة" : "استفسار سريع"}</p>
            <p><b>اليوم:</b> {item.day}</p>
            <p><b>التاريخ:</b> {item.date}</p>
            <p><b>الساعة:</b> {item.time}</p>
            <p><b>الحالة:</b> {item.status}</p>
            <p><b>الكود:</b> {item.trackingCode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
