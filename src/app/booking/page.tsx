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
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">

      <div className="w-full max-w-6xl">

        {/* TITLE */}
        <h1 className="text-5xl font-extrabold text-center text-black leading-relaxed tracking-tight">
          حجز موعد
        </h1>

        <p className="text-center text-gray-600 -mt-2 mb-10 text-lg">
          يرجى ملء التفاصيل التالية لإكمال الحجز
        </p>

        <form
          onSubmit={submitBooking}
          className="bg-white/70 backdrop-blur-sm w-full p-10 rounded-3xl shadow-2xl border border-gray-200 space-y-8"
        >

          {/* ERROR */}
          {error && (
            <p className="bg-red-100 text-red-700 p-4 rounded-lg text-center font-semibold">
              {error}
            </p>
          )}

          {/* INPUTS GRID 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* NAME */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">الاسم*</label>
              <input
                name="name"
                placeholder="اكتب اسمك"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm"
                onChange={handleChange}
              />
            </div>

            {/* AGE */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">السن*</label>
              <input
                name="age"
                type="number"
                placeholder="السن"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm"
                onChange={handleChange}
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">رقم الهاتف*</label>
              <input
                name="phone"
                placeholder="01000000000"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm"
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">الإيميل*</label>
              <input
                name="email"
                placeholder="example@gmail.com"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm"
                onChange={handleChange}
              />
            </div>

          </div>

          {/* INPUTS GRID 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* TYPE */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">نوع الحجز*</label>
              <select
                name="type"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm"
                onChange={handleChange}
              >
                <option value="clinic">كشف</option>
                <option value="follow">متابعة</option>
                <option value="quick">استشارة</option>
              </select>
            </div>

            {/* الكشف */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">نوع الكشف*</label>
              <select
                name="method"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm"
                onChange={handleChange}
              >
                <option value="online">اونلاين</option>
                <option value="clinic">في العيادة</option>
              </select>
            </div>

            {/* الفرع */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">اختر الفرع*</label>
              <select
                name="branch"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm"
                onChange={handleChange}
              >
                <option>القاهرة</option>
                <option>الجيزة</option>
                <option>الإسكندرية</option>
              </select>
            </div>
          </div>

          {/* DATE & TIME */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 text-right">
              اختر التاريخ والوقت*
            </label>
            <input
              type="datetime-local"
              name="datetime"
              className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm"
              onChange={handleChange}
            />
          </div>

          {/* DAY AUTO */}
          {form.day && (
            <p className="text-right text-cyan-700 font-bold text-lg">
              اليوم المختار: {form.day}
            </p>
          )}

          {/* NOTES */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-right">
              ملاحظات (اختياري)*
            </label>
            <textarea
              name="notes"
              placeholder="معلومات إضافية…"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-cyan-500 outline-none min-h-[140px] shadow-sm"
              onChange={handleChange}
            ></textarea>
          </div>

          {/* BUTTON */}
          <button className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white p-4 rounded-xl font-bold text-xl transition shadow-lg active:scale-95">
            احجز الآن
          </button>

          {/* TRACK */}
          <p
            className="text-center text-cyan-700 font-bold cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/track")}
          >
            متابعة الحجز
          </p>

        </form>
      </div>

    </div>
  );


}
