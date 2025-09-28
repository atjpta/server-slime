import { Schema } from 'mongoose'
import { createModal } from '~/core/models/mongo.model'
import { IBaseDocument } from '~/shared/interfaces'

export interface ILevel extends IBaseDocument {
  level: number
  nextLevelExp: number
}

const schema = new Schema<ILevel>({
  level: {
    type: Number,
    required: true,
  },
  nextLevelExp: {
    type: Number,
    required: true,
  },
})

export const LevelModel = createModal<ILevel>('levels', schema)
