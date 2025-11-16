import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import QuickQuery from "../../../../models/QuickQuery";
import { verifyUser } from "../../../../lib/auth";

export async function GET() {
  await dbConnect();

  const admin = await verifyUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
  }

  const queries = await QuickQuery.find().sort({ createdAt: -1 }).populate("userId", "name phone email");
  // normalize user field
  const mapped = queries.map((q) => ({
    ...q.toObject(),
    user: q.userId ? { name: q.userId.name, phone: q.userId.phone, email: q.userId.email } : null,
  }));

  return NextResponse.json(mapped);
}
