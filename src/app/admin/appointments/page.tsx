"use client";

import { useEffect, useState } from "react";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch("/api/admin/appointments");
    const data = await res.json();

    if (res.ok) {
      setAppointments(data);
      setFiltered(data);
    }

    setLoading(false);
  };

  const applyFilters = () => {
    let arr = [...appointments];

    if (search) {
      arr = arr.filter(
        (i) =>
          i.name.includes(search) ||
          i.phone.includes(search) ||
          i.trackingCode.includes(search)
      );
    }

    if (statusFilter) {
      arr = arr.filter((i) => i.status === statusFilter);
    }

    if (typeFilter) {
      arr = arr.filter((i) => i.type === typeFilter);
    }

    if (dateFilter) {
      arr = arr.filter((i) => i.date === dateFilter);
    }

    setFiltered(arr);
  };

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, typeFilter, dateFilter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/appointments/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    load();
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setNewDate(item.date);
    setNewTime(item.time);
    setEditModal(true);
  };

  const saveEdit = async () => {
    await fetch("/api/admin/appointments/update-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editItem._id,
        date: newDate,
        time: newTime,
      }),
    });

    setEditModal(false);
    load();
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 text-xl mt-20">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">
        إدارة الحجوزات
      </h1>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-4 gap-4 border">

        <input
          placeholder="بحث بالاسم / الهاتف / الكود"
          className="p-3 border rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-lg"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">الحالة</option>
          <option value="pending">قيد الانتظار</option>
          <option value="confirmed">تم التأكيد</option>
          <option value="canceled">ملغي</option>
        </select>

        <select
          className="p-3 border rounded-lg"
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">النوع</option>
          <option value="clinic">عيادة</option>
          <option value="quick">استفسار سريع</option>
        </select>

        <input
          type="date"
          className="p-3 border rounded-lg"
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow border overflow-x-auto">

        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center">لا توجد نتائج</p>
        ) : (
          <table className="w-full text-right min-w-[900px]">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3">الاسم</th>
                <th className="p-3">الهاتف</th>
                <th className="p-3">النوع</th>
                <th className="p-3">التاريخ</th>
                <th className="p-3">الوقت</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50">

                  <td className="p-3">{b.name}</td>
                  <td className="p-3">{b.phone}</td>
                  <td className="p-3">
                    {b.type === "clinic" ? "عيادة" : "استفسار سريع"}
                  </td>
                  <td className="p-3">{b.date}</td>
                  <td className="p-3">{b.time}</td>

                  <td className="p-3">
                    {b.status === "pending" && (
                      <span className="text-yellow-600 font-bold">قيد الانتظار</span>
                    )}
                    {b.status === "confirmed" && (
                      <span className="text-green-600 font-bold">تم التأكيد</span>
                    )}
                    {b.status === "canceled" && (
                      <span className="text-red-600 font-bold">ملغي</span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2">

                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={() => updateStatus(b._id, "confirmed")}
                    >
                      تأكيد
                    </button>

                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={() => updateStatus(b._id, "canceled")}
                    >
                      إلغاء
                    </button>

                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => openEdit(b)}
                    >
                      تعديل
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">تعديل الموعد</h2>

            <input
              type="date"
              className="w-full p-3 border rounded-lg mb-3"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />

            <input
              type="time"
              className="w-full p-3 border rounded-lg mb-3"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setEditModal(false)}
              >
                إلغاء
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={saveEdit}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
