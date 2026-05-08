import { auth } from "@/auth"
import connectDb from "@/lib/db"
import User from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email || session.user.role != "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 400 })
        }
        const pendingPartners = await User.find({
            role: "partner",
            partnerOnboardingStep: 4,
            videoKycStatus: {
                $in: ["pending", "in_progress"]
            }
        })
        return NextResponse.json(pendingPartners, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: `Admin Dashboard Error: ${error}` }, { status: 500 })
    }
}