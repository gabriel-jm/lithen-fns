export function applyEvent(
  docFrag: DocumentFragment,
  key: string,
  eventListener: Function
) {
  const element = docFrag.querySelector(`[${key}]`)
  
  if (!element) return
  
  const [rawEventName] = key.split('=')
  const [prefix, eventName] = rawEventName.split('-')
  const options = prefix === 'once'
    ? { once: true }
    : undefined
  
  element.addEventListener(
    eventName,
    eventListener as EventListener,
    options
  )
}
