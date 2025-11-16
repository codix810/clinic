import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Booking from "../../../../models/Booking";
import { verifyUser } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { id } = body;

    const user = await verifyUser();

    if (!user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
    }

    const booking = await Booking.findOne({ _id: id, userId: user.id });

    if (!booking) {
      return NextResponse.json({ error: "الحجز غير موجود" }, { status: 404 });
    }

    booking.status = "cancelled";
    await booking.save();

    return NextResponse.json({ message: "تم إلغاء الحجز" });
  } catch (err) {
    console.log("Cancel Error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء الإلغاء" },
      { status: 500 }
    );
  }
}
