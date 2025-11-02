import mongoose from 'mongoose'
import { env } from './env.config'
import { LevelService } from '~/features/levels/services'
import { SpeciesService } from '~/features/species/services'

export const connectMongoDB = async () => {
  const mongoUri = env.MONGO_URI
  if (!mongoUri) {
    throw new Error('⚠️ MONGO_URI not set in .env file')
  }
  await mongoose.connect(mongoUri)
  // await InitDB()
}

export const InitDB = async () => {
  await LevelService.initDB()
  await SpeciesService.initDB()
}
