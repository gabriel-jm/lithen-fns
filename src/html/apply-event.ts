export function applyEvent(
  docFrag: DocumentFragment,
  key: string,
  eventListener: Function
) {
  const element = docFrag.querySelector(`[${key}]`)
  
  if (!element) return
  
  const [rawEventName] = key.split('=')
  const eventName = rawEventName.substring('on-'.length)
  
  element.removeAttribute(rawEventName)
  element.addEventListener(eventName, eventListener as EventListener)
}
