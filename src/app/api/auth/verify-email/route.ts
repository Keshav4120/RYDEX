import connectDb from "@/lib/db";
import User  from "@/models/user.model";

export async function POST(req: Request) {
    try {
        await connectDb()
        const { email, otp } = await req.json()
        if (!email && !otp) {
            return Response.json(
                { message: "email and otp is required" },
                { status: 400 }
            )
        }
        let user = await User.findOne({ email })
        if (!user) {
            return Response.json(
                { message: "User not found" },
                { status: 400 }
            )
        }
        if (user.isEmailVerified) {
            return Response.json(
                { message: "email is already verifired" },
                { status: 400 }
            )
        }
        if (!user.otpExpires || user.otpExpires < new Date()) {
            return Response.json(
                { message: "otp has been expired" },
                { status: 400 }
            )
        }
        if (!user.otp||user.otp != otp) {
            return Response.json(
                { message: "Invalid Otp" },
                { status: 400 }
            )
        }

        user.isEmailVerified=true
        user.otp=undefined
        user.otpExpires=undefined
        await user.save()
return Response.json(
                { message: "email is verified" },
                { status: 200 }
            )
    } catch (error) {
                    return Response.json(
                { message: `Something went wrong ${error}` },
                { status: 500 }
            )
    }
}