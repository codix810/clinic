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

  const { id, doctorId } = await req.json();
  await QuickQuery.findByIdAndUpdate(id, { assignedTo: doctorId, status: "replied" });

  return NextResponse.json({ success: true });
}
