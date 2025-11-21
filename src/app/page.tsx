"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarHeart, Clock3, Stethoscope, Users } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  const features = [
    {
      titel: "التقويم الطبي",
      des: "متابعة جميع المواعيد والجداول الزمنية",
      icon: <CalendarHeart size={36} />,
      link: "/profile",
    },
    {
      titel: "ملفات الأطباء",
      des: "تصفح ملفات الأطباء واختر المناسب لك",
      icon: <Users size={36} />,
      link: "/profile",
    },
    {
      titel: "لوحة تحكم الطبيب",
      des: "إدارة شاملة للمواعيد و المرضي والسجلات الطبية",
      icon: <Stethoscope size={36} />,
      link: "/profile",
    },
    {
      titel: "حجز المواعيد",
      des: "نظام سهل وسريع لحجز المواعيد مع أطبائك المفضلين",
      icon: <Clock3 size={36} />,
      link: "/booking",
    },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          setUser(await res.json());
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* HERO */}
      <section className="bg-gradient-to-br from-cyan-500 via-blue-400/50 to-cyan-400/50 w-full py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* TEXT */}
          <div className="text-white">
            <h2 className="text-5xl font-extrabold leading-snug mb-6 drop-shadow-xl">
              نظام متكامل لإدارة المواعيد الطبية
            </h2>

            <p className="text-xl max-w-md leading-relaxed mb-10 opacity-90">
              منصة حديثة وسهلة الاستخدام لحجز المواعيد الطبية وإدارة العيادات بكفاءة عالية.
            </p>

            {!loading && (
              <>
                {!user && (
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => router.push("/login")}
                      className="px-8 py-3 border border-white/70 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-blue-600 transition font-bold rounded-xl shadow-lg"
                    >
                      تسجيل الدخول
                    </button>

                    <button
                      onClick={() => router.push("/register")}
                      className="px-8 py-3 bg-white text-blue-700 text-lg font-bold rounded-xl hover:bg-gray-200 transition shadow-xl"
                    >
                      إنشاء حساب
                    </button>
                  </div>
                )}

                {user?.role === "patient" && (
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => router.push("/booking")}
                      className="px-8 py-3 bg-white text-blue-700 text-lg rounded-xl shadow-md hover:bg-gray-200 transition"
                    >
                      احجز الآن
                    </button>

                    <button
                      onClick={() => router.push("/quick-query")}
                      className="px-8 py-3 bg-green-500 text-white text-lg rounded-xl hover:bg-green-600 transition shadow-md"
                    >
                      استفسار سريع
                    </button>

                    <button
                      onClick={() => router.push("/profile")}
                      className="px-8 py-3 bg-gray-700 text-white text-lg rounded-xl hover:bg-gray-800 transition"
                    >
                      البروفايل
                    </button>
                  </div>
                )}

                {user?.role === "doctor" && (
                  <button
                    onClick={() => router.push("/doctor")}
                    className="px-8 py-3 bg-purple-600 text-white text-lg rounded-xl shadow-lg hover:bg-purple-700 transition"
                  >
                    لوحة الطبيب
                  </button>
                )}

                {user?.role === "admin" && (
                  <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="px-8 py-3 bg-red-600 text-white text-lg rounded-xl shadow-lg hover:bg-red-700 transition"
                  >
                    لوحة التحكم
                  </button>
                )}
              </>
            )}
          </div>

          {/* IMAGE */}
          <div className="flex-1 flex justify-center">
            <div className="w-80 h-80 rounded-3xl shadow-2xl shadow-white/20 bg-white/20 backdrop-blur-lg overflow-hidden border border-white/20">
              <img src="./n.jpg" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-extrabold text-gray-800">مميزات النظام</h3>
          <p className="text-lg font-bold mb-10 mt-4 text-gray-500">
            كل ما تحتاجه لإدارة المواعيد الطبية بسهولة وكفاءة
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10">
            {features.map((i) => (
              <div
                key={i.link}
                onClick={() => router.push(i.link)}
                className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-xl transition cursor-pointer group"
              >
                <span className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-cyan-100 text-cyan-600 rounded-full group-hover:bg-cyan-500 group-hover:text-white transition">
                  {i.icon}
                </span>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">{i.titel}</h4>
                <p className="text-gray-600 text-lg leading-relaxed">{i.des}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTOR STATS */}
      <section ref={ref} className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">

          {/* الأرقام */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">

            <div className="flex flex-col items-center">
              <p className="text-5xl font-extrabold text-cyan-400">
                +{inView && <CountUp end={50} duration={2} />}
              </p>
              <p className="text-xl text-gray-700 mt-2">عيادة ومستشفى</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-5xl font-extrabold text-cyan-400">
                +{inView && <CountUp end={5000} duration={2} />}
              </p>
              <p className="text-xl text-gray-700 mt-2">مريض راضٍ</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-5xl font-extrabold text-cyan-400">
                +{inView && <CountUp end={500} duration={2} />}
              </p>
              <p className="text-xl text-gray-700 mt-2">طبيب مسجل</p>
            </div>

          </div>

          {/* من نحن */}
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6">من نحن</h3>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              نحن نقدم حلولاً تقنية متقدمة لتسهيل عملية حجز المواعيد الطبية وإدارة العيادات.
              نظامنا يساعد الأطباء على إدارة مواعيدهم بكفاءة ويوفر للمرضى تجربة سلسة وسهلة.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              نؤمن بأن التكنولوجيا يمكن أن تحسن جودة الرعاية الصحية وتوفر الوقت والجهد للجميع.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-cyan-400 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">

          <h3 className="text-4xl font-bold text-white mb-6">
            جاهز للبدء؟
          </h3>

          <p className="text-xl text-white/90 leading-relaxed mb-10">
            انضم إلى آلاف الأطباء والمرضى الذين يستخدمون نظامنا لتحسين تجربة الرعاية الصحية
          </p>

          <button
            onClick={() => router.push("/booking")}
            className="bg-white text-cyan-600 font-semibold text-lg py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition cursor-pointer"
          >
            احجز موعدك الآن
          </button>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white text-black py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-2xl font-bold mb-4">نظام إدارة المواعيد</h3>
            <p className="text-gray-500 leading-relaxed">
              منصة حديثة لإدارة المواعيد الطبية بسهولة وكفاءة،  
              تساعد الأطباء والمرضى على تحسين تجربة الرعاية الصحية.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-black">
              <li className="hover:text-gray-500 cursor-pointer">الرئيسية</li>
              <li className="hover:text-gray-500 cursor-pointer">المميزات</li>
              <li className="hover:text-gray-500 cursor-pointer">من نحن</li>
              <li className="hover:text-gray-500 cursor-pointer">الخدمات</li>
              <li className="hover:text-gray-500 cursor-pointer">حجز موعد</li>
              <li className="hover:text-gray-500 cursor-pointer">تسجيل الدخول</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">فروعنا</h4>
            <p className="text-black">الرياض — السعودية</p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">تواصل معنا</h4>
            <p className="text-black">الهاتف: 966+ 12 345 6789</p>
            <p className="text-black mt-2">العنوان: الرياض، السعودية</p>
          </div>

        </div>

        <div className="border-t border-gray-300 mt-10 pt-4 text-center text-black text-sm">
          © {new Date().getFullYear()} نظام إدارة المواعيد الطبية — جميع الحقوق محفوظة
        </div>
      </footer>

    </div>
  );
}
