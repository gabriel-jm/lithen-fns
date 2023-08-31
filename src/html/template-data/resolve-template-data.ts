import { pipeResolvers } from './pipe-resolvers.js'
import { TemplateData } from './resolver-types.js'
import { resolveDotProperty } from './resolvers/resolve-dot-property.js'
import { resolveFunctionValue } from './resolvers/resolve-function-value.js'

export function resolveTemplateData(value: TemplateData) {
  const resolvedString = pipeResolvers(
    value,
    resolveDotProperty,
    resolveFunctionValue
  )

  return {
    ...value,
    resolvedString
  }
}
