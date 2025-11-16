import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/db";
import Booking from "../../../../../models/Booking";
import { verifyUser } from "../../../../../lib/auth";

export async function POST(req: Request) {
  await dbConnect();
  
  const admin = await verifyUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
  }

  const { id, status } = await req.json();

  await Booking.findByIdAndUpdate(id, { status });

  return NextResponse.json({ success: true });
}
