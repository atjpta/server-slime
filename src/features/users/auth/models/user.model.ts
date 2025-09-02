import { Schema } from 'mongoose'
import { createModal } from '~/core/models/mongo.model'
import { providerEnum, userStatusEnum } from '~/shared/enums'
import { IUser } from '~/shared/interfaces'

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
    enum: providerEnum,
    required: true,
  },
  status: {
    type: String,
    enum: userStatusEnum,
    required: true,
    default: userStatusEnum.ACTIVE,
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
