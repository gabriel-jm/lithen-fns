import { placeElement } from '@/html/elements/place-element'

function generateDocFragment(htmlContent: string) {
  const template = document.createElement('template')
  template.innerHTML = htmlContent

  return template.content
}

describe('placeElement', () => {
  it('should return if target element does not have any placeholder element', () => {
    const targetElement = document.createDocumentFragment()
    const queryResult = {
      length: 0,
      forEach() {}
    }

    const forEachSpy = vi.spyOn(queryResult, 'forEach')
    const querySelectorAllSpy = vi.spyOn(targetElement, 'querySelectorAll')
    querySelectorAllSpy.mockReturnValueOnce(queryResult as unknown as NodeListOf<Element>)

    placeElement(targetElement, 'elm-id="elm-2"', document.createDocumentFragment())

    expect(forEachSpy).not.toHaveBeenCalled()
  })

  it('should get all elements from array and append the corresponding elements on the parent element', () => {
    const template = document.createElement('template')
    template.innerHTML = '<template elm-id="elm-0"></template>'

    const targetElement = template.content

    const querySelectorSpy = vi.spyOn(targetElement, 'querySelector')

    placeElement(
      targetElement,
      'elm-id="elm-0"',
      [document.createElement('div'), '<p>Injected</p>' as unknown as Node]
    )

    const childDiv = targetElement.querySelector('div')
    const childTemplate = targetElement.querySelector('template')

    expect(querySelectorSpy).toHaveBeenCalledWith('template[elm-id="elm-0"]')
    expect(childDiv).toBeDefined()
    expect(targetElement.childNodes[0]).toEqual(childDiv)
    expect(childTemplate).toBeNull()
    expect(targetElement.querySelector('p')).toBeNull()
  })

  it('should get a NodeList and append the corresponding elements on the parent element', () => {
    const parentElement = document.createElement('template')
    parentElement.innerHTML = `
      <span>any text</span>
      <template elm-id="elm-0"></template>
      <div>
        <template elm-id="elm-5"></template>
      </div>
    `
    const docFrag = parentElement.content

    placeElement(
      docFrag,
      'elm-id="elm-5"',
      [...generateDocFragment('<input />').childNodes]
    )

    const childInput = docFrag.querySelector('input')

    expect(childInput).toBeInstanceOf(HTMLInputElement)
    expect(childInput?.parentElement).toEqual(docFrag.querySelector('div'))
    
    expect(docFrag.querySelector('template[elm-id="elm-5"]')).toBeNull()
  })
})
