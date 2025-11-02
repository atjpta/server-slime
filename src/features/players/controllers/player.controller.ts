import { Controller, Route } from '~/core/decorators'
import { HttpMethodEnum } from '~/shared/enums'
import { Response } from 'express'
import { IRequest } from '~/shared/interfaces/request.interface'
import ResponseHelper from '~/core/helpers/response.helper'
import { authMiddleware } from '~/features/users/auth/middlewares'
import { PlayerModel } from '~/features/players/models'

@Controller('/api/players')
export class PlayerController {
  @Route(HttpMethodEnum.GET, '/my-player', authMiddleware)
  async myPlayer(req: IRequest, res: Response) {
    const player = await PlayerModel.findOne({ user: req.user.id })
      .populate('species')
      .populate('level')
    return ResponseHelper.success({ req, res }, player)
  }
}
