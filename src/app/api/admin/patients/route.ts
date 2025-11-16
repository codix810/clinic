import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import { verifyUser } from "../../../../lib/auth";

export async function GET() {
  await dbConnect();

  const admin = await verifyUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
  }

  const patients = await User.find({ role: "patient" }).sort({ createdAt: -1 });

  return NextResponse.json(patients);
}
