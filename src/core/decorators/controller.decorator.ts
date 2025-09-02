export function Controller(prefix: string = '') {
  return function (target: any) {
    if (!target.prototype.routes) {
      target.prototype.routes = []
    }
    if (!target.prototype.middlewares) {
      target.prototype.middlewares = []
    }
    target.prototype.prefix = prefix
  }
}
