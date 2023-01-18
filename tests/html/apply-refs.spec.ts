import { ref } from '@/html'
import { applyRefs } from '@/html/apply-refs'

describe('applyRefs', () => {
  it('should apply the correct element reference to the ref object', () => {
    const elementRef = ref()
    const refsMap = new Map([
      ['ref="ref-0"', elementRef]
    ])
    const template = document.createElement('template')
    template.innerHTML = `<div ref="ref-0"><p>Text</p></div>`
    const docFrag = template.content

    const div = docFrag.querySelector('div')

    applyRefs(docFrag, refsMap)

    expect(elementRef.el).toEqual(div)
    expect(refsMap.size).toBe(0)
    expect(div?.getAttribute('ref')).toBeNull()
  })
})
