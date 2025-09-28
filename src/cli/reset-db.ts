import mongoose from 'mongoose'
import { logger } from '@colyseus/core'
import { InitDB } from '~/configs'
import { Program } from './program'

Program.command('reset-db')
  .description('Drop entire MongoDB database and re-initialize')
  .action(async () => {
    try {
      logger.info(`Connecting to MongoDB at ${process.env.MONGO_URI} ...`)
      await mongoose.connect(process.env.MONGO_URI)

      logger.warn('Dropping database...')
      await mongoose.connection.db.dropDatabase()

      logger.info('Database dropped ✅')

      await InitDB()

      logger.info('Database initialized ✅')
      process.exit(0)
    } catch (err) {
      logger.error('❌ Error while resetting DB:', err)
      process.exit(1)
    }
  })
