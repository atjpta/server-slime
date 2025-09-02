import { DIContainer } from '../dependency-injection'

export function Inject(...deps: any[]) {
  return function (target: any) {
    DIContainer.setInjectMetadata(target, deps)
  }
}
