"use client";

import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

    

      {/* HERO */}
      <section className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-20 pb-24 gap-12">

        {/* TEXT */}
        <div className="flex-1 text-right">
          <h2 className="text-5xl font-extrabold text-gray-900 leading-snug mb-6">
            احجز كشفك بسهولة  
            <span className="text-blue-700"> ودون انتظار</span>
          </h2>

          <p className="text-gray-600 text-xl max-w-md leading-relaxed mb-10">
            خدمة حجز طبي متطورة — سرعة، دقة، تجربة مريحة، واستفسارات فورية مع متابعة لحظية.
          </p>

          <div className="flex justify-end gap-4 flex-wrap">
            <button
              onClick={() => router.push("/booking")}
              className="px-8 py-3 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition shadow-md active:scale-[.97]"
            >
              احجز الآن
            </button>

            <button
              onClick={() => router.push("/quick-query")}
              className="px-8 py-3 bg-green-600 text-white text-lg rounded-xl hover:bg-green-700 transition shadow-md active:scale-[.97]"
            >
              استفسار سريع
            </button>
          </div>
        </div>

        {/* VISUAL */}
        <div className="flex-1 flex justify-center">
          <div className="w-80 h-80 bg-white rounded-3xl shadow-xl border flex items-center justify-center">
            <span className="text-gray-200 text-6xl font-bold select-none">
              LOGO
            </span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white py-20 border-t shadow-inner">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h3 className="text-4xl font-bold mb-10 text-gray-800">
            خدماتنا
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <h4 className="text-2xl font-bold mb-4 text-blue-700">حجز عيادة</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                احجز كشف طبي بميعاد محدد وسعر ثابت—بدون انتظار أو زحمة.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <h4 className="text-2xl font-bold mb-4 text-green-700">استفسار سريع</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                اسأل الدكتور مباشرة واحصل على إجابة سريعة مدعومة بالخبرة.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <h4 className="text-2xl font-bold mb-4 text-purple-700">متابعة الحجز</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                تابع حالة الحجز، اليوم، الساعة والملاحظات بكل سهولة.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* DOCTOR */}
      <section className="py-20 px-6 bg-gray-100 text-center">
        <h3 className="text-4xl font-bold text-gray-900 mb-6">
          الطبيب المشرف
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto text-xl leading-relaxed">
          د. المنصوري — خبرة قوية في تشخيص وعلاج الحالات الطبية، مع تركيز على تقديم
          أفضل رعاية وتجربة للمريض بدون تعقيد.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-200 py-4 text-center text-gray-600 text-sm border-t">
        © {new Date().getFullYear()} — عيادة المنصوري — جميع الحقوق محفوظة
      </footer>

    </div>
  );
}
