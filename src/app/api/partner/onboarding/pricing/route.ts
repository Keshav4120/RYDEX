import uploadOnCloudinary from "@/lib/cloudinary"
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email) {
            return Response.json({ status: 400, message: "Unauthorized" })
        }
        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return Response.json({ status: 400, message: "User not found" })
        }

        const vehicle = await Vehicle.findOne({ owner: partner._id })
        if (!vehicle) {
            return Response.json({ status: 400, message: "Vehicle not found" })
        }

        const formData = await req.formData()
        const image = formData.get("image") as File | null
        const baseFare = formData.get("baseFare")
        const pricePerKm = formData.get("pricePerKm")
        const waitingCharge = formData.get("waitingCharge")

        const vehicleUpdate: Record<string, any> = {
            status: "pending",
            rejectionReason: null
        }

        if (image && image.size > 0) {
            vehicleUpdate.imageUrl = await uploadOnCloudinary(image)
        }
        if (baseFare !== null) vehicleUpdate.baseFare = Number(baseFare)
        if (pricePerKm !== null) vehicleUpdate.pricePerKm = Number(pricePerKm)
        if (waitingCharge !== null) vehicleUpdate.waitingCharge = Number(waitingCharge)

        await Vehicle.findByIdAndUpdate(vehicle._id, { $set: vehicleUpdate }, { runValidators: false })
        await User.findByIdAndUpdate(partner._id, { $set: { partnerOnboardingStep: 6 } }, { runValidators: false })

        return Response.json({ status: 200, message: "Pricing Submitted" })

    } catch (error) {
        console.log(error)
        return Response.json({ status: 500, message: "Internal server error" })
    }
}



export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email) {
            return Response.json({ status: 400, message: "Unauthorized" })
        }
        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return Response.json({ status: 400, message: "User not found" })
        }

        const vehicle = await Vehicle.findOne({ owner: partner._id })
        if (!vehicle) {
            return Response.json({ status: 400, message: "Vehicle not found" })
        }
        return Response.json({ status: 200, vehicle })
    } catch (error: any) {
        console.log(error)
        return Response.json({ status: 500, message: "Internal server error" })
    }
}
