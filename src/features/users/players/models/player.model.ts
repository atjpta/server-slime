import { Schema } from 'mongoose'
import { createModal } from '~/core/models/mongo.model'
import { DateTime } from 'luxon'
import { IBaseDocument } from '~/shared/interfaces'
import { ILevel } from '../../levels/models'
import { ISpecies } from '../../species/models'
import { IUser } from '../../auth/models'

export interface IPlayer extends IBaseDocument {
  name: string
  level: ILevel
  species: ISpecies
  user: IUser
  currentExp: number
  lastLogin?: DateTime
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
})

export const PlayerModel = createModal<IPlayer>('players', schema)
