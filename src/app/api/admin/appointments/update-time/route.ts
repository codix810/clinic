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

  const { id, date, time } = await req.json();

  await Booking.findByIdAndUpdate(id, { date, time });

  return NextResponse.json({ success: true });
}
