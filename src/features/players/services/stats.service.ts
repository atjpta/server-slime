import { IStats, IStatsDetail } from '~/features/players/models'

export class StatsService {
  public getStatsInit() {
    const statsDetailInit: IStatsDetail = {
      hp: {
        base: 1000,
      },
      attack: {
        base: 100,
      },
      magic: {
        base: 100,
      },
    }
    const statsInit = this.calStatsDetail(statsDetailInit)

    return { statsDetailInit, statsInit }
  }

  public calStatsDetail(statsDetail: IStatsDetail): IStats {
    const hp = Object.values(statsDetail.hp).reduce((sum, val) => sum + val, 0)
    const attack = Object.values(statsDetail.attack).reduce(
      (sum, val) => sum + val,
      0
    )
    const magic = Object.values(statsDetail.magic).reduce(
      (sum, val) => sum + val,
      0
    )
    return { hp, attack, magic }
  }
}
