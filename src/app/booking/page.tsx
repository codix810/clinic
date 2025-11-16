"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 


export default function BookingPage() {

  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    type: "clinic",
    datetime: "",
    day: "",
    notes: "",
  });

  const [error, setError] = useState("");

  const daysMap: any = {
    0: "الأحد",
    1: "الاثنين",
    2: "الثلاثاء",
    3: "الأربعاء",
    4: "الخميس",
    5: "الجمعة",
    6: "السبت",
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "datetime") {
      const dateObj = new Date(value);
      const dayName = daysMap[dateObj.getDay()];

      setForm({
        ...form,
        datetime: value,
        day: dayName,
      });

      return;
    }

    setForm({ ...form, [name]: value });
  };

  const submitBooking = async (e: any) => {
    e.preventDefault();
    setError("");

    const dateObj = new Date(form.datetime);

    const payload = {
      ...form,
      date: form.datetime.split("T")[0],
      time: form.datetime.split("T")[1],
      day: form.day,
      age: Number(form.age),
    };

    const res = await fetch("/api/booking/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "حدث خطأ أثناء الحجز");
      return;
    }

    window.location.href = `/booking/success?code=${data.trackingCode}`;
  };
useEffect(() => {
  const check = async () => {
    const res = await fetch("/api/auth/me");
    if (!res.ok) {
      window.location.href = "/login?redirect=booking";
    }
  };
  check();
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 p-6">

      <form
        onSubmit={submitBooking}
        className="bg-white w-full max-w-xl p-8 rounded-3xl shadow-2xl border border-blue-100 space-y-6"
      >

        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-2 tracking-tight">
          احجز كشفك الآن
        </h1>

        <p className="text-center text-gray-500 -mt-3">
          حجز سهل – وقتك محفوظ – متابعة فورية
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center font-semibold">
            {error}
          </p>
        )}

        {/* NAME */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">الاسم</label>
          <input
            name="name"
            placeholder="اكتب اسمك"
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          />
        </div>

        {/* AGE */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">السن</label>
          <input
            name="age"
            type="number"
            placeholder="السن"
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">رقم الهاتف</label>
          <input
            name="phone"
            placeholder="01000000000"
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">الإيميل</label>
          <input
            name="email"
            placeholder="example@gmail.com"
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">نوع الحجز</label>
          <select
            name="type"
            className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          >
            <option value="clinic">حجز عيادة — 200 جنيه</option>
            <option value="quick">استفسار سريع — 50 جنيه</option>
          </select>
        </div>

        {/* DATETIME PICKER */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            اختار التاريخ والوقت
          </label>
          <input
            type="datetime-local"
            name="datetime"
            className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          />
        </div>

        {/* AUTO-DAY */}
        {form.day && (
          <p className="text-blue-700 font-bold text-right text-lg">
            اليوم: {form.day}
          </p>
        )}

        {/* NOTES */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            ملاحظات (اختياري)
          </label>
          <textarea
            name="notes"
            placeholder="معلومات إضافية…"
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none min-h-[120px]"
            onChange={handleChange}
          ></textarea>
        </div>

        {/* BUTTON */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold text-xl transition shadow-md active:scale-95">
          تأكيد الحجز
        </button>

        {/* TRACK CTA */}
        <p
          className="text-center text-blue-700 font-bold cursor-pointer hover:underline mt-1"
          onClick={() => (window.location.href = "/track")}
        >
          متابعة الحجز
        </p>
      </form>
    </div>
  );
}
