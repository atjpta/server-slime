type Constructor<T> = new (...args: any[]) => T

class Container {
  private services = new Map<Constructor<any>, any>()
  private injectMetadata = new Map<Constructor<any>, Constructor<any>[]>()

  register<T>(cls: Constructor<T>, instance?: T) {
    if (!this.services.has(cls)) {
      this.services.set(cls, instance ?? new cls())
    }
  }

  resolve<T>(cls: Constructor<T>): T {
    const deps = this.injectMetadata.get(cls) || []
    const depInstances = deps.map((d) => this.resolve(d))
    const instance = new cls(...depInstances)
    this.services.set(cls, instance)
    return instance
  }

  setInjectMetadata(target: Constructor<any>, deps: Constructor<any>[]) {
    this.injectMetadata.set(target, deps)
  }
}

export const DIContainer = new Container()
