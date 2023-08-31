import { TemplateData } from '../resolver-types.js'

const eventOnEndRegex = /.*\s(on-[\w\-]+)=$/s

export function resolveFunctionValue(value: TemplateData) {
  const { currentHTML, resources, hash, index, data } = value

  if (typeof data !== 'function') return

  const match = currentHTML.match(eventOnEndRegex)

  if (match) {
    const eventType = match[1]
    const eventId = `"${hash}-${index}"`
    const eventKey = `${eventType}=${eventId}`

    resources.set(eventKey, value)

    return eventId
  }

  const shellMatch = currentHTML.match(
    /.*<shell\s+[^<>]*signal="([\w-]+)"[^<>]*>\s*$/
  )

  if (shellMatch) {
    const signalId = shellMatch[1]
    const shellSignalId = `shell-signal="${hash}-${signalId}"`
    const shellSignalData = resources.get(shellSignalId)
    
    resources.set(shellSignalId, {
      ...shellSignalData ?? {},
      renderFn: value
    })

    return ''
  }
}
