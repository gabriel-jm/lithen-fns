import { Resolver, TemplateData } from './resolver-types.js'

export class ResolverChain {
  resolvers: Resolver[]

  constructor(...resolvers: Resolver<any>[]) {
    this.resolvers = resolvers
  }

  pipe(value: TemplateData) {
    for (const resolver of this.resolvers) {
      const stringResult = resolver(value)
  
      if (stringResult !== undefined) {
        return stringResult
      }
    }
  }
}
