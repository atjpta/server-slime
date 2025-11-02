import { auth, JWT } from '@colyseus/auth'
import { DateTime } from 'luxon'
import { env, resend } from '~/configs'
import { UserModel } from '~/features/users/auth/models'
import { ProviderEnum, UserStatusEnum } from '~/shared/enums'
import mongoose from 'mongoose'
import { StatsService } from '~/features/players/services/stats.service'
import { LevelModel } from '~/features/levels/models'
import { PlayerModel } from '~/features/players/models'
import { SpeciesModel } from '~/features/species/models'

auth.backend_url = env.BACKEND_URL
// auth.prefix = '/auth'

const statsService = new StatsService()

auth.settings.onGenerateToken = async (userdata: any) => {
  return JWT.sign(
    {
      providerId: userdata.providerId,
    },
    { expiresIn: '30d' }
  )
}

auth.settings.onParseToken = async function (data) {
  const record = await UserModel.findOne({
    providerId: data.providerId,
  })
  const userdata = record?.toJSON()
  delete userdata?.password
  return userdata
}

auth.settings.onFindUserByEmail = async (email) => {
  const record = await UserModel.findOneAndUpdate(
    { email: email },
    { lastLogin: DateTime.now() }
  )
  return record?.toJSON() as any
}

auth.settings.onRegisterWithEmailAndPassword = async (
  email,
  password,
  options
) => {
  const username = options.name || email.split('@')[0]
  const user = await UserModel.create({
    username,
    email,
    password,
    provider: ProviderEnum.EMAIL,
    providerId: email,
    status: UserStatusEnum.ACTIVE,
    lastLogin: DateTime.now(),
    verified: false,
  })
  const playerId = new mongoose.Types.ObjectId()
  const species = await SpeciesModel.findOne()
  const level = await LevelModel.findOne({ level: 1 })
  const { statsDetailInit, statsInit } = statsService.getStatsInit()
  await PlayerModel.create({
    name: 'player_' + playerId,
    _id: playerId,
    species: species.id,
    user: user.id,
    level: level.id,
    stats: statsInit,
    statsDetail: statsDetailInit,
  })

  return user.toJSON()
}

auth.settings.onForgotPassword = async function (
  email: string,
  html: string /* , resetLink: string */
) {
  console.log('onForgotPassword')

  await resend.emails.send({
    to: email,
    subject: '[Your project]: Reset password',
    from: 'xxx@your-game.io',
    html: html,
  })
}

auth.settings.onResetPassword = async function (
  email: string,
  password: string
) {
  await UserModel.updateOne({ providerId: email }, { password })
  return true
}

auth.settings.onSendEmailConfirmation = async function (email, html, link) {
  console.log(link)
  await resend.emails.send({
    to: email,
    subject: '[Your project]: Confirm your email address',
    from: 'no-reply@your-game.io',
    html: html,
  })
}

auth.settings.onEmailConfirmed = async function (email) {
  await UserModel.updateOne({ providerId: email }, { verified: true })
  return true
}

auth.oauth.addProvider(ProviderEnum.GOOGLE, {
  key: env.GOOGLE_CLIENT_ID,
  secret: env.GOOGLE_CLIENT_SECRET,
  // scope: ['profile', 'email'],
  scope: ['userinfo.profile', 'email'],
})

auth.oauth.addProvider(ProviderEnum.DISCORD, {
  key: env.DISCORD_CLIENT_ID,
  secret: env.DISCORD_CLIENT_SECRET,
  scope: ['identify', 'email'],
})

// auth.oauth.addProvider(ProviderEnum.FACEBOOK, {
//   key: env.FACEBOOK_CLIENT_ID,
//   secret: env.FACEBOOK_CLIENT_SECRET,
//   scope: ['gaming_profile', 'email'],
// })

auth.oauth.addProvider(ProviderEnum.GITHUB, {
  key: env.GITHUB_CLIENT_ID,
  secret: env.GITHUB_CLIENT_SECRET,
  scope: ['read:user', 'user:email'],
})

auth.oauth.onCallback(async (data, provider) => {
  const profile = data.profile
  console.log('DATA:', data)
  const raw = {
    username: profile.global_name || profile.username || profile.name,
    email: profile.email,
    provider: provider,
    providerId: profile.id,
    status: UserStatusEnum.ACTIVE,
    lastLogin: DateTime.now(),
    verified: true,
  }
  let user = await UserModel.findOneAndUpdate(
    { providerId: raw.providerId },
    raw
  )

  if (!user) {
    user = await UserModel.create(raw)
  }
  return user.toJSON()
})

export const AuthService = auth
