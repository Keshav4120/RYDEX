import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/db";
import User from "./models/user.model";
import { error } from "console";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
  credentials: {
    email: {
      type: "email",
      label: "Email",
      placeholder: "johndoe@gmail.com",
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "*****",
    },
  },
  async authorize(credentials, request) {
    if(!credentials.email || !credentials.password) {
      throw Error("missing credentials")
    }
    const email = credentials.email;
    const password = credentials.password as string;
    await connectDb()
    const user = await User.findOne({email}) //If we doest make email then we have to write email:credentials.email

    if(!user) {
      throw Error("User doesn't exists!")
    }
    const isMatch = await bcrypt.compare(password , user.password)

    if(!isMatch) {
      throw Error("Incorrect Password")
    }

    return {
      // so here we return a object so that we can store that data in cookies
    id:user._id,
    name:user.name,
    email:user.email,
    role:user.role
    }
  },
})
//we can also add other credentials here like google and github
  ],
  callbacks:{
  }
})