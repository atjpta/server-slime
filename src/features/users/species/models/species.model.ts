import { Schema } from 'mongoose'
import { createModal } from '~/core/models/mongo.model'
import { IBaseDocument } from '~/shared/interfaces'
import { RarityEnum } from '~/shared/enums/rarity.enum'

export interface ISpecies extends IBaseDocument {
  key: string
  rarity: RarityEnum
}

const schema = new Schema<ISpecies>(
  {
    key: {
      type: String,
      required: true,
    },
    rarity: {
      type: String,
      enum: Object.values(RarityEnum),
      required: true,
      default: RarityEnum.COMMON,
    },
  },
  { timestamps: true }
)

export const SpeciesModel = createModal<ISpecies>('species', schema)
