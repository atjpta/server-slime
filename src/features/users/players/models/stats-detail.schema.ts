import { Schema } from 'mongoose'

export interface IStatsDetailBase {
  base: number
}

export interface IStatsDetail {
  hp: IStatsDetailBase
  attack: IStatsDetailBase
  magic: IStatsDetailBase
}

export const HpDetailSchema = new Schema<IStatsDetailBase>({
  base: {
    type: Number,
    required: true,
  },
})
export const AttackDetailSchema = new Schema<IStatsDetailBase>({
  base: {
    type: Number,
    required: true,
  },
})
export const MagicDetailSchema = new Schema<IStatsDetailBase>({
  base: {
    type: Number,
    required: true,
  },
})

export const StatsDetailSchema = new Schema<IStatsDetail>(
  {
    hp: {
      type: HpDetailSchema,
      required: true,
    },
    attack: {
      type: AttackDetailSchema,
      required: true,
    },
    magic: {
      type: MagicDetailSchema,
      required: true,
    },
  },
  { _id: false }
)
