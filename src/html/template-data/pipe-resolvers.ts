import { Resolver, TemplateData } from './resolver-types.js'

export function pipeResolvers(value: TemplateData, ...resolvers: Resolver<any>[]) {
  for (const resolver of resolvers) {
    const stringResult = resolver(value)

    if (stringResult !== undefined) {
      return stringResult
    }
  }
}

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
