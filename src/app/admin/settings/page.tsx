"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    clinicName: "",
    address: "",
    phone1: "",
    phone2: "",
    logo: "",
    priceClinic: 200,
    priceQuick: 50,
    workingHours: "",
    whatsappMessage: "",
  });

  const [logoFile, setLogoFile] = useState<any>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    if (res.ok && data) setSettings(data);
    setLoading(false);
  };

  const updateSettings = async () => {
    const body = { ...settings };

    if (logoFile) {
      // رفع اللوجو لكلاوديناري
      const formData = new FormData();
      formData.append("file", logoFile);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const upload = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const uploadedImg = await upload.json();
      body.logo = uploadedImg.secure_url;
    }

    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    alert("تم تحديث الإعدادات بنجاح");
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">إعدادات العيادة</h1>

      <div className="bg-white p-6 rounded-2xl shadow border space-y-6">

        {/* CLINIC NAME */}
        <div>
          <label className="font-bold mb-1 block text-gray-700">اسم العيادة</label>
          <input
            className="w-full p-3 border rounded-lg"
            value={settings.clinicName}
            onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="font-bold mb-1 block text-gray-700">العنوان</label>
          <input
            className="w-full p-3 border rounded-lg"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          />
        </div>

        {/* PHONES */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold mb-1 block text-gray-700">هاتف 1</label>
            <input
              className="w-full p-3 border rounded-lg"
              value={settings.phone1}
              onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
            />
          </div>
          <div>
            <label className="font-bold mb-1 block text-gray-700">هاتف 2</label>
            <input
              className="w-full p-3 border rounded-lg"
              value={settings.phone2}
              onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
            />
          </div>
        </div>

        {/* PRICES */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold mb-1 block text-gray-700">سعر الحجز</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={settings.priceClinic}
              onChange={(e) => setSettings({ ...settings, priceClinic: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="font-bold mb-1 block text-gray-700">سعر الاستفسار السريع</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={settings.priceQuick}
              onChange={(e) => setSettings({ ...settings, priceQuick: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* WORKING HOURS */}
        <div>
          <label className="font-bold mb-1 block text-gray-700">أوقات العمل</label>
          <input
            className="w-full p-3 border rounded-lg"
            placeholder="مثال: من 2م لـ 10م — السبت: إجازة"
            value={settings.workingHours}
            onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
          />
        </div>

        {/* LOGO UPLOAD */}
        <div>
          <label className="font-bold mb-1 block text-gray-700">لوجو العيادة</label>
          <input type="file" onChange={(e) => setLogoFile(e.target.files?.[0])} />
          {settings.logo && (
            <img src={settings.logo} className="w-24 mt-3 rounded-xl border" />
          )}
        </div>

        {/* WHATSAPP MSG */}
        <div>
          <label className="font-bold mb-1 block text-gray-700">رسالة واتساب تلقائية</label>
          <textarea
            className="w-full p-3 border rounded-lg min-h-[120px]"
            value={settings.whatsappMessage}
            onChange={(e) =>
              setSettings({ ...settings, whatsappMessage: e.target.value })
            }
          ></textarea>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={updateSettings}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold text-lg shadow"
        >
          حفظ التعديلات
        </button>

      </div>
    </div>
  );
}
