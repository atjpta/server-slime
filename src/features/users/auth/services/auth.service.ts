import { auth, JWT } from '@colyseus/auth'
import { DateTime } from 'luxon'
import { env, resend } from '~/configs'
import { UserModel } from '~/features/users/auth/models'
import { providerEnum, userStatusEnum } from '~/shared/enums'

auth.backend_url = env.BACKEND_URL
// auth.prefix = '/auth'

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
  const record = await UserModel.create({
    username,
    email,
    password,
    provider: providerEnum.EMAIL,
    providerId: email,
    status: userStatusEnum.ACTIVE,
    lastLogin: DateTime.now(),
    verified: false,
  })
  return record.toJSON()
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

auth.oauth.addProvider(providerEnum.GOOGLE, {
  key: env.GOOGLE_CLIENT_ID,
  secret: env.GOOGLE_CLIENT_SECRET,
  // scope: ['profile', 'email'],
  scope: ['userinfo.profile', 'email'],
})

auth.oauth.addProvider(providerEnum.DISCORD, {
  key: env.DISCORD_CLIENT_ID,
  secret: env.DISCORD_CLIENT_SECRET,
  scope: ['identify', 'email'],
})

// auth.oauth.addProvider(providerEnum.FACEBOOK, {
//   key: env.FACEBOOK_CLIENT_ID,
//   secret: env.FACEBOOK_CLIENT_SECRET,
//   scope: ['gaming_profile', 'email'],
// })

auth.oauth.addProvider(providerEnum.GITHUB, {
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
    status: userStatusEnum.ACTIVE,
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
