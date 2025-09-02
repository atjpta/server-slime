import { Controller, Route } from '~/core/decorators'
import { httpMethodEnum } from '~/shared/enums'
import { Response } from 'express'
import { IRequest } from '~/shared/interfaces/request.interface'
import { authMiddleware } from '../middlewares'
import ResponseHelper from '~/core/helpers/response.helper'

@Controller('/api')
export class AuthController {
  @Route(httpMethodEnum.GET, '/test-auth', authMiddleware)
  async test(req: IRequest, res: Response) {
    return ResponseHelper.success({ req, res }, req.user)
  }
}
