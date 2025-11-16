"use client";

import { Suspense } from "react";
import SuccessContent from "./success-content";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-10">جاري التحميل...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
