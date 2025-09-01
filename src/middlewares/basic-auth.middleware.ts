import expressBasicAuth from 'express-basic-auth'

export const basicAuthMiddleware = expressBasicAuth({
  users: {
    admin: 'admin',
  },
  // sends WWW-Authenticate header, which will prompt the user to fill
  // credentials in
  challenge: true,
})
