import { ResourceMaps } from './html-tag-fn.js';

export function applyEvents (
  docFrag: DocumentFragment,
  eventsMap: ResourceMaps['eventsMap']
) {
  for (const [key, eventListener] of Object.entries(eventsMap)) {
    const element = docFrag.querySelector(`[${key}]`)
    
    if (!element) continue
    
    const [rawEventName] = key.split('=')
    const eventName = rawEventName.substring('on-'.length)
    
    element.removeAttribute(rawEventName)
    element.addEventListener(eventName, eventListener as EventListener)
  }
}
