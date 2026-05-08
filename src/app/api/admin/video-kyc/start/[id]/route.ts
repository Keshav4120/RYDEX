import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email || session.user.role != "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 400 })
        }
        const partnerId = (await context.params).id
        const partner = await User.findById(partnerId)

        if (!partner || partner.role != "partner") {
            return Response.json({ error: "Partner not found" }, { status: 404 })
        }


        const roomId = `kyc-${partner._id}-${Date.now()}`
        partner.videoKycRoomId = roomId
        partner.videoKycStatus = "in_progress"
        partner.partnerOnboardingStep = 4
        await partner.save()

        return Response.json({ message: "Video KYC started", roomId })
    } catch (error) {
        return Response.json({ error: "Internal Server Error" }, { status: 500 })
    }
}