import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Booking from "../../../../models/Booking";
import QuickQuery from "../../../../models/QuickQuery";

export async function GET() {
  await dbConnect();

  const today = new Date().toISOString().split("T")[0];

  const todayBookings = await Booking.countDocuments({ date: today });
  const todayQueries = await QuickQuery.countDocuments({
    createdAt: { $gte: new Date(today) },
  });

  const clinicRevenue = await Booking.aggregate([
    { $match: { date: today } },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);

  const queryRevenue = await QuickQuery.aggregate([
    { $match: { createdAt: { $gte: new Date(today) } } },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);

  const todayRevenue =
    (clinicRevenue[0]?.total || 0) + (queryRevenue[0]?.total || 0);

  const pendingAppointments = await Booking.find({ status: "pending" }).limit(5);
  const pendingQueries = await QuickQuery.find({ status: "pending" }).limit(5);

  return NextResponse.json({
    todayBookings,
    todayQueries,
    todayRevenue,
    pendingAppointments,
    pendingQueries,
  });
}
