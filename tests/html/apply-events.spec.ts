import { applyEvent } from '@/html/events/apply-event'

describe('applyEvents', () => {
  it('should add the correct events to the correct elements', () => {
    const template = document.createElement('template')
    template.innerHTML = `
      <div id="el-1" on-click="evt-0">
        <span id="el-2">Text</span>
        <input id="el-3" on-input="evt-4" />
      </div>
    `

    const targetElement = template.content

    const divChild = targetElement.querySelector('#el-1')!
    const divAddEventListenerSpy = vi.spyOn(divChild, 'addEventListener')

    const spanChild = targetElement.querySelector('#el-2')!
    const spanAddEventListenerSpy = vi.spyOn(spanChild, 'addEventListener')

    const inputChild = targetElement.querySelector('#el-3')!
    const inputAddEventListenerSpy = vi.spyOn(inputChild, 'addEventListener')

    const divFakeFn = vi.fn()
    const inputFakeFn = vi.fn()

    applyEvent(targetElement, 'on-click="evt-0"', () => divFakeFn())
    applyEvent(targetElement, 'on-input="evt-4"', () => inputFakeFn())

    divChild.dispatchEvent(new Event('click'))
    inputChild.dispatchEvent(new Event('input'))

    expect(divChild.hasAttribute('on-click')).toBe(false)
    expect(divAddEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
    expect(divFakeFn).toHaveBeenCalled()

    expect(spanAddEventListenerSpy).not.toHaveBeenCalled()

    expect(inputChild.hasAttribute('on-input')).toBe(false)
    expect(inputAddEventListenerSpy).toHaveBeenCalledWith('input', expect.any(Function))
    expect(inputFakeFn).toHaveBeenCalled()
  })

  it('should not do anything if the element is not found', () => {
    const template = document.createElement('template')
    template.innerHTML = `
      <div on-click="evt-0">
        <span>Text</span>
        <input />
      </div>
    `

    const targetElement = template.content

    const div = targetElement.querySelector('div')!
    const removeAttributeSpy = vi.spyOn(div, 'removeAttribute')

    applyEvent(targetElement, 'on-click="evt-4"', () => null)

    expect(removeAttributeSpy).not.toHaveBeenCalled()
  })
})
