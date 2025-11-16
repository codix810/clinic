import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, phone, password } = body;

    // Validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "كل البيانات مطلوبة" },
        { status: 400 }
      );
    }

    // Check if user exists
    const exist = await User.findOne({ email });
    if (exist) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // Hash Password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "patient",
    });

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح", user: { id: user._id, email: user.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    );
  }
}
