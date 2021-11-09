import { applyEvents } from '@/html/apply-events'

describe('applyEvents', () => {
  it('should add the correct events to the correct elements', () => {
    const targetElement = document.createElement('div')
    targetElement.innerHTML = `
      <div id="el-1" on-click="evt-0">
        <span id="el-2">Text</span>
        <input id="el-3" on-input="evt-4" />
      </div>
    `
    const divChild = targetElement.querySelector('#el-1')!
    const divAddEventListenerSpy = jest.spyOn(divChild, 'addEventListener')

    const spanChild = targetElement.querySelector('#el-2')!
    const spanAddEventListenerSpy = jest.spyOn(spanChild, 'addEventListener')

    const inputChild = targetElement.querySelector('#el-3')!
    const inputAddEventListenerSpy = jest.spyOn(inputChild, 'addEventListener')

    const divFakeFn = jest.fn()
    const inputFakeFn = jest.fn()

    const eventsMap = {
      'evt-0': () => divFakeFn(),
      'evt-4': () => inputFakeFn()
    }

    applyEvents(targetElement, eventsMap)

    divChild.dispatchEvent(new Event('click'))
    inputChild.dispatchEvent(new Event('input'))

    expect(divChild.hasAttribute('on-click')).toBe(false)
    expect(divAddEventListenerSpy).toHaveBeenCalledWith('click', eventsMap['evt-0'])
    expect(divFakeFn).toHaveBeenCalled()

    expect(spanAddEventListenerSpy).not.toHaveBeenCalled()

    expect(inputChild.hasAttribute('on-input')).toBe(false)
    expect(inputAddEventListenerSpy).toHaveBeenCalledWith('input', eventsMap['evt-4'])
    expect(inputFakeFn).toHaveBeenCalled()
  })
})
