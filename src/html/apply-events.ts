import { ResourceMaps } from './html-tag-fn.js';

interface AttributesRecord {
  attrName: string
  attrValue: string
}

export function applyEvents (
  docFrag: DocumentFragment,
  eventsMap: ResourceMaps['eventsMap'],
  targetElement: DocumentFragment | Element = docFrag
) {
  const children = [...targetElement.children]

  for (const element of children) {
    const attributesRecords = Array
      .from(element.attributes)
      .map(attribute => {
        const attrName = attribute.nodeName || attribute.name
        const attrValue = String(attribute.nodeValue || attribute.value)

        if (!(/^on-[\w\-]+/).test(attrName)) {
          return
        }

        return <AttributesRecord> {
          attrName,
          attrValue
        }
      })
      .filter(Boolean) as AttributesRecord[]

    attributesRecords.forEach((record) => {
      const eventId = String(element.getAttribute(record.attrName))
      const eventListener = eventsMap[eventId]
      const eventName = record.attrName.substring('on-'.length)

      element.addEventListener(eventName, eventListener as EventListener)

      element.removeAttribute(record.attrName)
    })

    applyEvents(docFrag, eventsMap, element)
  }
}
