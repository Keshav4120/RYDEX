import mongoose from "mongoose"

const mongodburl = process.env.MONGODB_URL

if(!mongodburl) {
    throw new Error("db url is not found")
}


let cached=global.mongooseConn

if(!cached) {
    cached = global.mongooseConn={conn:null,promise:null}
}

const connectDb = async () => {
    if(cached.conn) {
        return cached.conn
    }


    if(!cached.promise) {
        cached.promise = mongoose.connect(mongodburl).then(c=>c.connection)
    }
    try {
        const conn = await cached.promise
        return conn
    } catch (error) {
        console.log(error)
    }
}
export default connectDb