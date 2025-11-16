import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import QuickQuery from "../../../../models/QuickQuery";
import { verifyUser } from "../../../../lib/auth";

export async function GET() {
  try {
    await dbConnect();

    const user = await verifyUser();

    if (!user) {
      return NextResponse.json(
        { error: "غير مسموح" },
        { status: 401 }
      );
    }

    const queries = await QuickQuery.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json(queries, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "خطأ في السيرفر" },
      { status: 500 }
    );
  }
}
