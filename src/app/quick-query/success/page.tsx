"use client";

import { useSearchParams } from "next/navigation";

export default function QuickQuerySuccess() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 p-6">

      <div className="bg-white shadow-2xl border border-green-200 rounded-3xl p-10 max-w-md w-full text-center animate-fadeIn">

        {/* SUCCESS ICON */}
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-green-700 mb-3">
          تم إرسال الاستفسار بنجاح
        </h1>

        <p className="text-gray-600 text-lg mb-2">
          كود متابعة الاستفسار:
        </p>

        <p className="text-3xl font-extrabold text-blue-700 tracking-widest bg-blue-50 py-3 rounded-xl shadow-inner mb-6">
          {code}
        </p>

        <p className="text-gray-600 mb-6">
          احتفظ بالكود لمتابعة رد الطبيب.
        </p>

        <button
          onClick={() => (window.location.href = "/quick-query/track")}
          className="w-full bg-green-600 hover:bg-green-700 active:scale-95 transition text-white p-3 rounded-xl font-bold text-lg shadow-md"
        >
          متابعة الاستفسار
        </button>

      </div>
    </div>
  );
}
