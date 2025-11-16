"use client";

import { Suspense } from "react";
import SuccessQuickQuery from "./success-content";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">جاري التحميل...</div>}>
      <SuccessQuickQuery />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
