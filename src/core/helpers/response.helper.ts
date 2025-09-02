import { ResponseStatus } from '~/shared/enums'
import { IHttpContext } from '~/shared/interfaces/request.interface'

export default class ResponseHelper {
  private static respond(
    ctx: IHttpContext,
    statusCode: number,
    data: any = null
  ) {
    return ctx.res.status(statusCode).json(data)
  }

  static success(ctx: IHttpContext, data: any) {
    return this.respond(ctx, ResponseStatus.OK, data)
  }

  static created(ctx: IHttpContext, data: any) {
    return this.respond(ctx, ResponseStatus.CREATED, data)
  }

  static noContent(ctx: IHttpContext) {
    return this.respond(ctx, ResponseStatus.NO_CONTENT)
  }

  static unauthorized(ctx: IHttpContext, data: any = null) {
    return this.respond(ctx, ResponseStatus.UNAUTHORIZED, data)
  }

  static unprocessableEntity(ctx: IHttpContext, data: any) {
    return this.respond(ctx, ResponseStatus.UNPROCESSABLE_ENTITY, data)
  }

  static notFound(ctx: IHttpContext, data: any = null) {
    return this.respond(ctx, ResponseStatus.NOT_FOUND, data)
  }

  static forbidden(ctx: IHttpContext, data: any = null) {
    return this.respond(ctx, ResponseStatus.FORBIDDEN, data)
  }

  // static SuccessWithPagination(
  //   ctx: IHttpContext,
  //   result: ModelPaginatorContract<any> | SimplePaginatorContract<any>,
  //   serializeParams: { fields: string[]; relations?: any } | null = null
  // ) {
  //   const { total, perPage, currentPage, lastPage } = result
  //   const data = result.all()

  //   return this.respond(ctx, ResponseStatus.Ok, {
  //     meta: { total, perPage, currentPage, lastPage },
  //     data: serializeParams
  //       ? data.map((item) => item.serialize(serializeParams))
  //       : data,
  //   })
  // }

  static file(ctx: IHttpContext, buffer: any, filename: string) {
    const res = ctx.res
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Type', 'application/octet-stream')

    return res.send(buffer)
  }
  static serviceUnavailable(ctx: IHttpContext, data: any = null) {
    return this.respond(ctx, ResponseStatus.SERVICE_UNAVAILABLE, data)
  }
}
