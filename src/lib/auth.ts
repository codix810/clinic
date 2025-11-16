import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function verifyUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    return null;
  }
}
