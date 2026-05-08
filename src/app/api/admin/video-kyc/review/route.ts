import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email || session.user.role != "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 400 })
        }
        
        const { roomId, status, reason } = await req.json()
        
        if (!roomId || !status) {
            return Response.json({ error: "Missing required fields" }, { status: 400 })
        }

        const partner = await User.findOne({ videoKycRoomId: roomId, role: "partner" })

        if (!partner) {
            return Response.json({ error: "Partner not found" }, { status: 404 })
        }

        const updateFields: Record<string, any> = { videoKycStatus: status }
        if (status === "approved") {
            updateFields.partnerOnboardingStep = 5
            updateFields.partnerStatus = "approved"
        } else if (status === "rejected") {
            updateFields.videoKycRejectionReason = reason || "Your video KYC was rejected by the admin."
            updateFields.partnerStatus = "rejected"
        }

        await User.findByIdAndUpdate(
            partner._id,
            { $set: updateFields },
            { runValidators: false }
        )

        return Response.json({ message: `Video KYC ${status}` })
    } catch (error) {
        return Response.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
