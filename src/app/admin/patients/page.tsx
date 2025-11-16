"use client";

import { useEffect, useState } from "react";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [detailsModal, setDetailsModal] = useState(false);
  const [active, setActive] = useState<any>(null);
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [queryList, setQueryList] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/patients");
    const data = await res.json();

    if (res.ok) {
      setPatients(data);
      setFiltered(data);
    }

    setLoading(false);
  };

  const applySearch = () => {
    if (!search) return setFiltered(patients);

    setFiltered(
      patients.filter(
        (p) =>
          p.name.includes(search) ||
          p.email.includes(search) ||
          p.phone.includes(search)
      )
    );
  };

  useEffect(() => applySearch(), [search]);

  const openDetails = async (user: any) => {
    setActive(user);

    const b = await fetch(`/api/admin/patients/${user._id}/bookings`);
    const q = await fetch(`/api/admin/patients/${user._id}/queries`);

    setBookingList(await b.json());
    setQueryList(await q.json());

    setDetailsModal(true);
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">جاري التحميل...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-purple-700 mb-6">إدارة المرضى</h1>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 border">
        <input
          placeholder="بحث بالاسم / الإيميل / الهاتف"
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="bg-white p-6 rounded-2xl shadow border">

        {filtered.length === 0 ? (
          <p className="text-gray-500">لا يوجد مرضى</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="border p-4 rounded-xl bg-gray-50 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg">{p.name}</p>
                  <p className="text-gray-500 text-sm">{p.email}</p>
                  <p className="text-gray-700">{p.phone}</p>
                </div>

                <button
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => openDetails(p)}
                >
                  عرض
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {detailsModal && active && (
        <div className="fixed inset-0 bg-black/40 p-4 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-lg overflow-y-auto max-h-[90vh]">

            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-purple-700">ملف المريض</h2>
              <button onClick={() => setDetailsModal(false)}>✕</button>
            </div>

            <div className="mt-4 space-y-2">
              <p><b>الاسم:</b> {active.name}</p>
              <p><b>الهاتف:</b> {active.phone}</p>
              <p><b>الإيميل:</b> {active.email}</p>
            </div>

            <hr className="my-4" />

            <h3 className="text-xl font-bold text-blue-700 mb-2">الحجوزات</h3>

            {bookingList.length === 0 ? (
              <p className="text-gray-500">لا يوجد حجوزات</p>
            ) : (
              bookingList.map((b) => (
                <div key={b._id} className="border rounded-lg p-3 mb-2 bg-gray-50">
                  <p><b>التاريخ:</b> {b.date}</p>
                  <p><b>الوقت:</b> {b.time}</p>
                  <p><b>الحالة:</b> {b.status}</p>
                </div>
              ))
            )}

            <hr className="my-4" />

            <h3 className="text-xl font-bold text-green-700 mb-2">الاستفسارات</h3>

            {queryList.length === 0 ? (
              <p className="text-gray-500">لا يوجد استفسارات</p>
            ) : (
              queryList.map((q) => (
                <div key={q._id} className="border rounded-lg p-3 mb-2 bg-gray-50">
                  <p><b>كود:</b> {q.trackingCode}</p>
                  <p><b>الأعراض:</b> {q.symptoms}</p>
                  <p><b>الحالة:</b> {q.status}</p>
                </div>
              ))
            )}

          </div>
        </div>
      )}

    </div>
  );
}
