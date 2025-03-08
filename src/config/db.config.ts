import * as mongoose from 'mongoose'
import { MongoClient } from 'mongodb'

const mongoUri = process.env.MONGO_URI

if (!mongoUri) {
  throw new Error('Missing MONGO_URI in environment variables')
}

const DB = async () => {
  try {
    // Connect Mongoose
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)

    // Connect MongoDB Client (for Better Auth)
    const mongoClient = new MongoClient(mongoUri)
    await mongoClient.connect()
    console.log('✅ MongoDB Client Connected for Better Auth')

    return { mongoose, mongoClient }
  } catch (err: any) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`)
    process.exit(1)
  }
}

export default DB
