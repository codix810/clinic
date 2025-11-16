import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "كل البيانات مطلوبة" },
        { status: 400 }
      );
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "patient",
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    const response = NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح", user: { id: user._id, email: user.email } },
      { status: 201 }
    );

    // Set cookie
    response.headers.append(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}`
    );

    return response;

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    );
  }
}
