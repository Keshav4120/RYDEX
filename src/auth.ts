import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/db";
import User from "./models/user.model";
import { error } from "console";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

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
    if(!credentials || !credentials.email || !credentials.password) {
      throw Error("missing credentials")
    }
    const email = credentials.email as string;
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
}) ,
  Google({
    clientId:process.env.AUTH_GOOGLE_ID as string,
    clientSecret:process.env.AUTH_GOOGLE_SECRET as string
  })
//we can also add other credentials here like google and github
  ],
  callbacks:{
    async signIn({user,account}){
      if(account?.provider == "google") {
        await connectDb()
        const dbUser = await User.findOne({email:user.email})
        if(!dbUser){
          await User.create({
            name : user.name,
            email: user.email
          })
        }
        user.id=dbUser._id
        user.role=dbUser.role
      }

      return true
    },
    async jwt({token,user}) {
      if (user){
        token.name = user.name;
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token
    },
    async session ({token , session}) {
      if(session.user){
        session.user.name = token.name;
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session
    }
  },
  pages:{
    signIn:"/signin",
    error:"/signin"
  },
  session:{
    strategy:"jwt",
    maxAge:10*24*60*60
  },
  secret:process.env.AUTH_SECRET
})