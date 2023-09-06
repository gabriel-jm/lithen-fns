import { sanitizeHTML } from '../sanitizes/sanitize-html.js'
import { ResolverChain } from './pipe-resolvers.js'
import { TemplateData } from './resolver-types.js'
import { resolveDotProperty } from './resolvers/resolve-dot-property.js'
import { resolveFunctionValue } from './resolvers/resolve-function-value.js'
import { resolveObjectValue } from './resolvers/resolve-object-value.js'

const resolverChain = new ResolverChain(
  resolveDotProperty,
  resolveFunctionValue,
  resolveObjectValue
)

export function resolveTemplateData(value: TemplateData) {
  const resolvedString = resolverChain.pipe(value)

  if (!resolvedString) {
    return sanitizeHTML(value.data)
  }

  return resolvedString
}
