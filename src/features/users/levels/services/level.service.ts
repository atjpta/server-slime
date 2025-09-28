import { logger } from '@colyseus/core'
import { LevelModel } from '../models'

export class LevelService {
  static async initDB() {
    const count = await LevelModel.countDocuments()
    if (count !== 0) {
      logger.info('Table Levels has been initialized before')
      return
    }

    let expStart = 1000
    const factorTier = 10
    const factorTier1 = 0.5
    const factorTier2 = 0.1

    const first = await this.generateLevels({
      levelStart: 1,
      levelEnd: 50,
      expStart,
      factor: factorTier1,
    })
    expStart = first[first.length - 1].nextLevelExp * factorTier

    await this.generateLevels({
      levelStart: 51,
      levelEnd: 100,
      expStart,
      factor: factorTier2,
    })

    logger.info('Table Levels initialized ✅')
  }

  static async generateLevels(props: {
    levelStart: number
    levelEnd: number
    expStart: number
    factor: number
  }) {
    const { expStart, factor, levelEnd, levelStart } = props
    const levels: { level: number; nextLevelExp: number }[] = []

    let exp = expStart
    for (let lv = levelStart; lv <= levelEnd; lv++) {
      levels.push({
        level: lv,
        nextLevelExp: Math.floor(exp),
      })
      exp += factor * exp
    }
    await LevelModel.insertMany(levels)
    return levels
  }
}
