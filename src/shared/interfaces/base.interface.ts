import { DateTime } from 'luxon'
import { Types } from 'mongoose'

export interface IBaseDocument {
  id: string
  _id: Types.ObjectId
  createdAt?: DateTime
  updatedAt?: DateTime
}
