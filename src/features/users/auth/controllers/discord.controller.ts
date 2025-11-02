import { Inject } from '~/core/decorators/inject.decorator'
import { Controller } from '~/core/decorators'
import { DiscordService } from '~/features/users/auth/services'

@Controller('/api')
@Inject(DiscordService)
export class DiscordController {
  constructor(private discordService: DiscordService) {}

  //   @Route(HttpMethodEnum.POST, '/discord_token')
  //   login = async (req: IRequest, res: Response) => {
  //     const accessToken = await this.discordService.retrieveAccessToken(
  //       req.body.code
  //     )

  //     const userRaw = await this.discordService.retrieveUserData(accessToken)
  //     const user = await UserModel.findOne({ providerId: userRaw.id })

  //     res.send({
  //       accessToken,
  //       token: await JWT.sign(user),
  //       user,
  //     })
  //   }
}
