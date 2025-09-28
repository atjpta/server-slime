import { Schema } from 'mongoose'
import { createModal } from '~/core/models/mongo.model'
import { ProviderEnum, UserStatusEnum } from '~/shared/enums'
import { DateTime } from 'luxon'
import { IBaseDocument } from '~/shared/interfaces'

export interface IUser extends IBaseDocument {
  username: string
  email?: string
  provider: ProviderEnum
  providerId: string
  password?: string
  lastLogin?: DateTime
  status: UserStatusEnum
  verified: boolean
}

const schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  providerId: {
    type: String,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  provider: {
    type: String,
    enum: ProviderEnum,
    required: true,
  },
  status: {
    type: String,
    enum: UserStatusEnum,
    required: true,
    default: UserStatusEnum.ACTIVE,
  },
  lastLogin: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
})

export const UserModel = createModal<IUser>('users', schema)
