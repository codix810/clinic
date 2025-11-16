import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import { verifyUser } from "../../../../lib/auth";

export async function PUT(req: Request) {
  try {
    await dbConnect();

    const userToken = await verifyUser();
    if (!userToken) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, email } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "جميع البيانات مطلوبة" },
        { status: 400 }
      );
    }

    const updated = await User.findByIdAndUpdate(
      userToken.id,
      { name, phone, email },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "تم تحديث البيانات بنجاح",
      user: updated,
    });
  } catch (err) {
    console.log("Update Error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث البيانات" },
      { status: 500 }
    );
  }
}
