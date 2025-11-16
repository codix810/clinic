import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/db";
import QuickQuery from "../../../../../../models/QuickQuery";
import { verifyUser } from "../../../../../../lib/auth";

export async function GET(req: Request, { params }: any) {
  await dbConnect();

  const admin = await verifyUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
  }

  const queries = await QuickQuery.find({ userId: params.id }).sort({ createdAt: -1 });

  return NextResponse.json(queries);
}
