import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import User from "@/models/user.model";
import bcrypt, { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async  function POST(req:NextRequest) {
    try {
        const {name,email,password} = await req.json()
        await connectDb()
        let user = await User.findOne({email})
        if(user && user.isEmailVerified) {
            return NextResponse.json(
                {message:"Email Already Exist!"},
                {status:400}
            )
        }
        const otp=Math.floor(100000+Math.random()*900000).toString()
        const otpExpires=new Date(Date.now()+3*60*1000)

        if(password.length < 6) {
            return NextResponse.json(
                {message:"Password is less then 6"},
                {status:400}
            )
        }
        const hashedPass = await bcrypt.hash(password , 10)
        if(user && !user.isEmailVerified){
            user.name=name
            user.password=hashedPass
            user.email=email
            user.otp=otp,
            user.otpExpires=otpExpires
            await user.save()
        }else{
            user=await User.create({
                name,email,password:hashedPass,otp,otpExpires
            })
        }

        await sendMail(
            email,"Your OTP for email verification",
            `<h2>Your Email Verification Otp is <strong>${otp}</strong></h2>`
        )
        
         return NextResponse.json(
                user,
                {status:200}
            )
    } catch (error) {
         return NextResponse.json(
                {message:`register error ${error}`},
                {status:500}
            )
    }
}