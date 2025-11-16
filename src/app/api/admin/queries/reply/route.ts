import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/db";
import QuickQuery from "../../../../../models/QuickQuery";
import { verifyUser } from "../../../../../lib/auth";

export async function POST(req: Request) {
  await dbConnect();
  const admin = await verifyUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
  }

  const { id, reply } = await req.json();
  await QuickQuery.findByIdAndUpdate(id, { reply, status: "replied" });

  // (اختياري) هنا ممكن ترسل إشعار/إيميل للمستخدم

  return NextResponse.json({ success: true });
}
