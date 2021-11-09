import { ResourceMaps } from './html-template';

interface AttributesRecord {
  attrName: string
  attrValue: string
}

export function applyEvents (
  targetElement: DocumentFragment | Element,
  eventsMap: ResourceMaps['eventsMap']
) {
  const children = [...targetElement.children]

  for (const element of children) {
    const attributesRecords = Array
      .from(element.attributes)
      .map(attribute => {
        if (!(/^on-[\w\-]+/).test(attribute.nodeName)) {
          return
        }

        return <AttributesRecord> {
          attrName: attribute.nodeName,
          attrValue: String(attribute.nodeValue)
        }
      })
      .filter(Boolean) as AttributesRecord[]

    attributesRecords.forEach((record) => {
      const eventId = String(element.getAttribute(record.attrName))
      const eventListener = eventsMap[eventId]
      const eventName = record.attrName.substring('on-'.length)

      element.addEventListener(eventName, eventListener)

      element.removeAttribute(record.attrName)
    })

    applyEvents(element, eventsMap)
  }
}
