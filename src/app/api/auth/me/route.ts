import { NextResponse } from "next/server";
import { verifyUser } from "../../../../lib/auth";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";

export async function GET() {
  try {
    await dbConnect();

const userToken = await verifyUser();

    if (!userToken) {
      return NextResponse.json(
        { error: "غير مصرح لك بالدخول" },
        { status: 401 }
      );
    }

    const user = await User.findById(userToken.id).select("-password");

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "خطأ في جلب بيانات المستخدم" },
      { status: 500 }
    );
  }
}
