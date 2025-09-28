import { logger } from '@colyseus/core'
import { SpeciesModel } from '../models'
import { RarityEnum } from '~/shared/enums/rarity.enum'

export class SpeciesService {
  static async initDB() {
    const count = await SpeciesModel.countDocuments()
    if (count !== 0) {
      logger.info('Table Species has been initialized before')
      return
    }

    await SpeciesModel.create({
      key: 'slime',
      rarity: RarityEnum.COMMON,
    })

    logger.info('Table Species initialized ✅')
  }
}
