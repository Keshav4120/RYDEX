import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const partner = await User.findOne({ email: session.user.email, role: "partner" })
        if (!partner) {
            return Response.json({ error: "Partner not found" }, { status: 404 })
        }

        if (partner.videoKycStatus !== "rejected") {
            return Response.json({ error: "Re-KYC can only be requested after a rejection" }, { status: 400 })
        }

        await User.findByIdAndUpdate(
            partner._id,
            { $set: { videoKycStatus: "re_requested" } },
            { runValidators: false }
        )

        return Response.json({ message: "Re-KYC requested successfully" })
    } catch (error) {
        console.error("Re-KYC request error:", error)
        return Response.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
