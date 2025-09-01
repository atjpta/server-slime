import mongoose from 'mongoose'
import { env } from './env.config'

export const connectMongoDB = async () => {
  const mongoUri = env.MONGO_URI
  if (!mongoUri) {
    throw new Error('⚠️ MONGO_URI not set in .env file')
  }
  await mongoose.connect(mongoUri)
}
