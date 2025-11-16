import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import QuickQuery from "../../../../models/QuickQuery";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { trackingCode } = await req.json();

    const query = await QuickQuery.findOne({ trackingCode });

    if (!query) {
      return NextResponse.json(
        { error: "لا يوجد استفسار بهذا الكود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ query }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "خطأ في السيرفر" },
      { status: 500 }
    );
  }
}
