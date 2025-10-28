import { Schema } from 'mongoose'
import { createModal } from '~/core/models/mongo.model'
import { DateTime } from 'luxon'
import { IBaseDocument } from '~/shared/interfaces'
import { PlayerRoleEnum } from '~/shared/enums'
import { ILevel } from '~/features/users/levels/models'
import { ISpecies } from '~/features/users/species/models'
import {
  IStats,
  IStatsDetail,
  StatsDetailSchema,
  StatsSchema,
} from '~/features/users/players/models'
import { IUser } from '~/features/users/auth/models'

export interface IPlayer extends IBaseDocument {
  name: string
  level: ILevel
  species: ISpecies
  user: IUser
  currentExp: number
  lastLogin?: DateTime
  role: PlayerRoleEnum
  stats: IStats
  statsDetail: IStatsDetail
}

const schema = new Schema<IPlayer>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: Schema.Types.ObjectId,
    ref: 'levels',
    required: true,
  },
  species: {
    type: Schema.Types.ObjectId,
    ref: 'species',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  currentExp: {
    type: Number,
    required: true,
    default: 0,
  },
  lastLogin: {
    type: Date,
  },
  role: {
    type: String,
    enum: PlayerRoleEnum,
    required: true,
    default: PlayerRoleEnum.PLAYER,
  },
  stats: {
    type: StatsSchema,
    required: true,
  },
  statsDetail: {
    type: StatsDetailSchema,
    required: true,
  },
})

export const PlayerModel = createModal<IPlayer>('players', schema)
