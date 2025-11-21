"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <header className="bg-white/50 shadow-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-2 py-4 flex justify-between items-center">

        {/* LOGO */}
        <h1
          className="text-2xl font-bold text-black cursor-pointer"
          onClick={() => router.push("/")}
        >
          نظام إدارة المواعيد الطبية <span className="bg-cyan-400 rounded-lg">🏥</span>
        </h1>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-black cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={32} /> : <Stethoscope size={32} />}
        </button>

        {/* NAVIGATION */}
        {!loading && (
          <nav
            className={`
            absolute md:static left-0 top-20 w-full md:w-auto
            flex flex-col md:flex-row
            items-center md:items-center
            gap-6
            bg-white md:bg-transparent
            py-6 md:py-0
            shadow-md md:shadow-none
            text-center

            transition-all duration-300

            ${open ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 md:opacity-100 md:translate-y-0"}
            ${open ? "pointer-events-auto" : "pointer-events-none md:pointer-events-auto"}
          `}
          >
            {/* زائر */}
            {!user && (
              <>
                <button onClick={() => router.push("/track")} className="nav-btn">
                  متابعة الحجز
                </button>
                <button onClick={() => router.push("/quick-query/track")} className="nav-btn">
                  متابعة الاستفسارات
                </button>
                <button onClick={() => router.push("/login")} className="login-btn">
                  تسجيل الدخول
                </button>
                <button onClick={() => router.push("/register")} className="primary-btn">
                  حساب جديد
                </button>
              </>
            )}

            {/* مريض */}
            {user?.role === "patient" && (
              <>
                <button onClick={() => router.push("/booking")} className="nav-btn">
                  احجز الآن
                </button>
                <button onClick={() => router.push("/quick-query")} className="nav-btn">
                  استفسار سريع
                </button>
                <button onClick={() => router.push("/track")} className="nav-btn">
                  متابعة الحجز
                </button>
                <button onClick={() => router.push("/profile")} className="nav-btn">
                  البروفايل
                </button>
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    window.location.href = "/";
                  }}
                  className="logout-btn"
                >
                  تسجيل الخروج
                </button>
              </>
            )}

            {/* دكتور */}
            {user?.role === "doctor" && (
              <>
                <button onClick={() => router.push("/doctor")} className="nav-btn">
                  لوحة الطبيب
                </button>
                <button onClick={() => router.push("/doctor/bookings")} className="nav-btn">
                  حجوزات اليوم
                </button>
                <button onClick={() => router.push("/doctor/patients")} className="nav-btn">
                  المرضى
                </button>
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    window.location.href = "/";
                  }}
                  className="logout-btn"
                >
                  تسجيل الخروج
                </button>
              </>
            )}

            {/* أدمن */}
            {user?.role === "admin" && (
              <>
                <button onClick={() => router.push("/admin/dashboard")} className="nav-btn">
                  لوحة التحكم
                </button>
                <button onClick={() => router.push("/admin/bookings")} className="nav-btn">
                  إدارة الحجوزات
                </button>
                <button onClick={() => router.push("/admin/users")} className="nav-btn">
                  المستخدمين
                </button>
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    window.location.href = "/";
                  }}
                  className="logout-btn"
                >
                  تسجيل الخروج
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
