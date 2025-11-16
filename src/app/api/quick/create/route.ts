import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import QuickQuery from "../../../../models/QuickQuery";
import { verifyUser } from "../../../../lib/auth";

function generateTrackingCode() {
  return "QK-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const user = await verifyUser();

    if (!user) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول قبل إرسال الاستفسار" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { symptoms } = body;

    if (!symptoms || symptoms.length < 10) {
      return NextResponse.json(
        { error: "يرجى كتابة الأعراض بشكل واضح" },
        { status: 400 }
      );
    }

    const trackingCode = generateTrackingCode();

    const query = await QuickQuery.create({
      userId: user.id,
      symptoms,
      price: 50,
      status: "pending",
      trackingCode,
    });

    return NextResponse.json(
      { message: "تم إرسال الاستفسار", trackingCode },
      { status: 201 }
    );

  } catch (err) {
    console.log("Quick Query Error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال الاستفسار" },
      { status: 500 }
    );
  }
}
