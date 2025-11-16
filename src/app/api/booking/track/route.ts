import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Booking from "../../../../models/Booking";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { trackingCode } = body;

    if (!trackingCode) {
      return NextResponse.json(
        { error: "يرجى إدخال كود المتابعة" },
        { status: 400 }
      );
    }

    const booking = await Booking.findOne({ trackingCode });

    if (!booking) {
      return NextResponse.json(
        { error: "لا يوجد حجز بهذا الكود" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "تم العثور على الحجز",
        booking,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Track Error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء عملية البحث" },
      { status: 500 }
    );
  }
}
