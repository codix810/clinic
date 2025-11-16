import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Booking from "../../../../models/Booking";
import { verifyUser } from "../../../../lib/auth";

function generateTrackingCode() {
  return "BK-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const user = await verifyUser();

    if (!user) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول قبل الحجز" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, age, phone, email, type, date, day, time, notes } = body;

    if (!name || !age || !phone || !email || !type || !date || !day || !time) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    const price = type === "quick" ? 50 : 200;
    const trackingCode = generateTrackingCode();

    const booking = await Booking.create({
      userId: user.id, // ثابت وإجباري
      name,
      age,
      phone,
      email,
      type,
      price,
      date,
      day,
      time,
      notes,
      trackingCode,
    });

    return NextResponse.json(
      {
        message: "تم إنشاء الحجز بنجاح",
        trackingCode,
        bookingId: booking._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log("Booking Error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحجز" },
      { status: 500 }
    );
  }
}
