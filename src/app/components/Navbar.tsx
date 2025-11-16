"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-white shadow-md border-b sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <h1
          className="text-2xl font-bold text-blue-700 cursor-pointer"
          onClick={() => router.push("/")}
        >
          عيادة المنصوري
        </h1>

        {!loading && (
          <nav className="flex items-center gap-6">

            {/* LINKS BASED ON ROLE */}

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

/* Tailwind Helper Classes */
