import { Schema } from 'mongoose'

export interface IStats {
  hp: number
  attack: number
  magic: number
}
export const StatsSchema = new Schema<IStats>(
  {
    hp: {
      type: Number,
      required: true,
    },
    attack: {
      type: Number,
      required: true,
    },
    magic: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)
