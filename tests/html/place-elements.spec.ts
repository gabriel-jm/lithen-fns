import { placeElements } from '@/html/place-elements'

describe('placeElements', () => {
  it('should return if target element does not have any placeholder element', () => {
    const targetElement = document.createElement('div')
    const queryResult = {
      length: 0,
      forEach() {}
    }

    const forEachSpy = jest.spyOn(queryResult, 'forEach')
    const querySelectorAllSpy = jest.spyOn(targetElement, 'querySelectorAll')
    querySelectorAllSpy.mockReturnValueOnce(queryResult as unknown as NodeListOf<Element>)

    placeElements(targetElement, {})

    expect(forEachSpy).not.toHaveBeenCalled()
  })
})
