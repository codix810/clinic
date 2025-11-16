import { NextResponse } from "next/server";

export async function POST() {
  // حذف الكوكيز بإرجاع Max-Age=0
  const response = NextResponse.json({
    message: "تم تسجيل الخروج بنجاح",
  });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0, // يمسح الكوكيز فورًا
  });

  return response;
}
