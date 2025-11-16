"use client";

import { useEffect, useState } from "react";

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [detailModal, setDetailModal] = useState(false);
  const [active, setActive] = useState<any>(null);

  const [doctors, setDoctors] = useState<any[]>([]);
  const [assignDoctorId, setAssignDoctorId] = useState("");
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    load();
    loadDoctors();
  }, []);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/queries");
    const data = await res.json();
    if (res.ok) {
      setQueries(data);
      setFiltered(data);
    }
    setLoading(false);
  };

  const loadDoctors = async () => {
    const res = await fetch("/api/admin/doctors");
    if (!res.ok) return;
    const d = await res.json();
    setDoctors(d);
  };

  const applyFilters = () => {
    let arr = [...queries];
    if (search) {
      arr = arr.filter(
        (q) =>
          q.trackingCode.includes(search) ||
          q.symptoms.toLowerCase().includes(search.toLowerCase()) ||
          q._id.includes(search)
      );
    }
    if (statusFilter) arr = arr.filter((q) => q.status === statusFilter);
    if (dateFilter) arr = arr.filter((q) => q.createdAt?.slice(0,10) === dateFilter);
    setFiltered(arr);
  };

  useEffect(() => applyFilters(), [search, statusFilter, dateFilter, queries]);

  const openDetail = (q: any) => {
    setActive(q);
    setReplyText(q.reply || "");
    setAssignDoctorId(q.assignedTo || "");
    setDetailModal(true);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/queries/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  const assignDoctor = async () => {
    if (!active) return;
    await fetch("/api/admin/queries/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: active._id, doctorId: assignDoctorId }),
    });
    setDetailModal(false);
    load();
  };

  const sendReply = async () => {
    if (!active) return;
    await fetch("/api/admin/queries/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: active._id, reply: replyText }),
    });
    setDetailModal(false);
    load();
  };

  if (loading) {
    return <div className="text-center text-gray-600 mt-20">جاري التحميل...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-green-700 mb-6">إدارة الاستفسارات</h1>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-4 gap-4 border">
        <input
          placeholder="بحث بالكود أو الأعراض"
          className="p-3 border rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="p-3 border rounded-lg" onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">الحالة</option>
          <option value="pending">قيد المراجعة</option>
          <option value="replied">تم الرد</option>
          <option value="closed">مغلق</option>
        </select>
        <input type="date" className="p-3 border rounded-lg" onChange={(e) => setDateFilter(e.target.value)} />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => { setSearch(""); setStatusFilter(""); setDateFilter(""); }}>
            مسح الفلاتر
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg" onClick={() => applyFilters()}>
            تطبيق
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center">لا توجد استفسارات</p>
        ) : (
          <div className="grid gap-4">
            {filtered.map((q) => (
              <div key={q._id} className="p-4 rounded-xl border bg-gray-50 flex justify-between items-start">
                <div>
                  <p className="font-bold">{q.trackingCode} — <span className="text-gray-600 font-medium">{q.user?.name || "مستخدم"}</span></p>
                  <p className="text-sm text-gray-700 mt-1">{q.symptoms.slice(0, 120)}{q.symptoms.length > 120 ? "..." : ""}</p>
                  <p className="text-sm text-gray-500 mt-2">التاريخ: {new Date(q.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div>
                    {q.status === "pending" && <span className="text-yellow-600 font-bold">قيد المراجعة</span>}
                    {q.status === "replied" && <span className="text-blue-600 font-bold">تم الرد</span>}
                    {q.status === "closed" && <span className="text-gray-500 font-bold">مغلق</span>}
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg" onClick={() => openDetail(q)}>فتح</button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded-lg" onClick={() => updateStatus(q._id, "replied")}>وضع مُراجع</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded-lg" onClick={() => updateStatus(q._id, "closed")}>اغلاق</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {detailModal && active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-green-700 mb-1">{active.trackingCode}</h2>
                <p className="text-sm text-gray-600 mb-2">المريض: {active.user?.name || "-" } — {active.user?.phone || "-"}</p>
                <p className="mb-3 text-gray-800">{active.symptoms}</p>
                <p className="text-sm text-gray-500">وقت الإرسال: {new Date(active.createdAt).toLocaleString()}</p>
              </div>

              <button className="text-gray-500" onClick={() => setDetailModal(false)}>✕</button>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">تعيين إلى دكتور</label>
                <select className="w-full p-3 border rounded-lg" value={assignDoctorId} onChange={(e) => setAssignDoctorId(e.target.value)}>
                  <option value="">-- اختر دكتور --</option>
                  {doctors.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>

                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg" onClick={assignDoctor}>تعيين</button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg" onClick={() => { setAssignDoctorId(""); }}>إلغاء</button>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">إرسال رد / ملاحظة</label>
                <textarea className="w-full p-3 border rounded-lg min-h-[120px]" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-2 bg-green-600 text-white rounded-lg" onClick={sendReply}>ارسال والابقاء مفتوح</button>
                  <button className="px-3 py-2 bg-red-500 text-white rounded-lg" onClick={() => { updateStatus(active._id, "closed"); setDetailModal(false); }}>ارسال وإغلاق</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
