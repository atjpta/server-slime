export class DiscordService {
  public async retrieveAccessToken(code: any) {
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
      }),
    })
    const { access_token } = await response.json()
    return access_token
  }

  public async retrieveUserData(token: string) {
    const profile = await (
      await fetch(`https://discord.com/api/users/@me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      })
    ).json()

    return profile
  }
}
