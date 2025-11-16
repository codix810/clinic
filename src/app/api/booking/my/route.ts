import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Booking from "../../../../models/Booking";
import { verifyUser } from "../../../../lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const user = await verifyUser();

    if (!user) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const bookings = await Booking.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (err) {
    console.log("My Booking Error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الحجوزات" },
      { status: 500 }
    );
  }
}
