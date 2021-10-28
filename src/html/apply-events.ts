import { ResourceMaps } from './html-template';

export function applyEvents (
  targetElement: DocumentFragment,
  eventsMap: ResourceMaps['eventsMap']
) {
  const children = [...targetElement.children]

  for (const element of children) {
    element.attributes
  }
}
