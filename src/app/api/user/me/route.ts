import { auth } from "@/auth";
import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Optional: If you need to fetch fresh data from the database instead of just session data
    await connectDb();
    
    // Check if the id is a valid ObjectId
    if (!session.user.id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error in /api/user/me:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message, stack: error.stack }, { status: 500 });
  }
}
