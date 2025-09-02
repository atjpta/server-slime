import { DateTime } from 'luxon'
import { IBaseDocument } from './base.interface'
import { providerEnum, userStatusEnum } from '../enums'

export interface IUser extends IBaseDocument {
  username: string
  email?: string
  provider: providerEnum
  providerId: string
  password?: string
  lastLogin?: DateTime
  status: userStatusEnum
  verified: boolean
}
