import { ResourceMaps } from './html-tag-fn';

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

      element.addEventListener(eventName, eventListener)

      element.removeAttribute(record.attrName)
    })

    applyEvents(element, eventsMap)
  }
}
