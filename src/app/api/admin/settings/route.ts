import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Settings from "../../../../models/Settings";
import { verifyUser } from "../../../../lib/auth";

export async function GET() {
  await dbConnect();

  const admin = await verifyUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
  }

  const settings = await Settings.findOne();
  return NextResponse.json(settings || {});
}

export async function POST(req: Request) {
  await dbConnect();

  const admin = await verifyUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
  }

  const body = await req.json();

  const settings = await Settings.findOne();

  if (!settings) {
    await Settings.create(body);
  } else {
    await Settings.updateOne({}, body);
  }

  return NextResponse.json({ success: true });
}
