import { html, raw } from '@/index'

function select(docFrag: DocumentFragment, query: string) {
  return docFrag.querySelector(query)
}

describe('html tag function', () => {
  it('should return a DocumentFragment with correct elements', () => {
    const docFrag = html`
      <p>Text</p>
      <div>
        <a href="#">link</a>
      </div>
    `

    expect(select(docFrag, 'p')?.textContent).toBe('Text')
    expect(select(docFrag, 'div')?.children[0]).toEqual(select(docFrag, 'a'))
    expect(select(docFrag, 'a')?.getAttribute('href')).toBe('#')
    expect(select(docFrag, 'a')?.textContent).toBe('link')
  })

  it('should add all elements from an array', () => {
    const docFrag = html`
      <div>${[
        html`<p id="el-1">any text</p>`,
        html`<p id="el-2">any value</p>`
      ]}</div>
    `

    expect(select(docFrag, '#el-1')?.textContent).toBe('any text')
    expect(select(docFrag, '#el-2')?.textContent).toBe('any value')
  })

  it('should add the correct event to the elements', () => {
    const fakeFn = jest.fn()
    const docFrag = html`
      <div>
        <button on-click=${fakeFn}>
          Click me
        </button>
      </div>

      <input on-input=${() => fakeFn()} />
    `

    select(docFrag, 'button')?.dispatchEvent(new Event('click'))
    select(docFrag, 'input')?.dispatchEvent(new Event('input'))

    expect(fakeFn).toHaveBeenCalledTimes(2)
  })

  it('should clean any lost custom event attributes', () => {
    const docFrag = html`
      <div on-click="">
        <p on-cust-event>any value</p>
        <a on-drag=${undefined as any} href="#">link</a>
        <span on-drop=${''}>any text</span>
        <b on-change=${null as any}>bold</b>
      </div>
    `

    expect(select(docFrag, 'div')?.hasAttribute('on-click')).toBe(false)
    expect(select(docFrag, 'a')?.hasAttribute('on-drag')).toBe(false)
    expect(select(docFrag, 'p')?.hasAttribute('on-cust-event')).toBe(false)
    expect(select(docFrag, 'span')?.hasAttribute('on-drop')).toBe(false)
    expect(select(docFrag, 'b')?.hasAttribute('on-change')).toBe(false)
  })

  it('should add elements from another DocumentFragment', () => {
    const docFrag = html`
      <header>
        ${html`<h1>Title</h1>`}
      </header>
      <footer>
        ${html`<p>Footer</p>`}
        <br />
        ${html`<span>testes</span>`}
      </footer>
    `

    expect(select(docFrag, 'header > h1')).not.toBeNull()
    expect(select(docFrag, 'footer > p')).not.toBeNull()
    expect(select(docFrag, 'span')?.previousElementSibling)
      .toEqual(select(docFrag, 'br'))
  })

  it('should add multiple elements from another DocumentFragment', () => {
    const docFrag = html`
      <header>
        ${html`
          <h1>Title</h1>
          <h2>Sub Title</h2>
          <p>Text</p>
        `}
      </header>
    `

    expect(select(docFrag, 'header > h1')).not.toBeNull()
    expect(select(docFrag, 'header > h2')).not.toBeNull()
    expect(select(docFrag, 'header > p')).not.toBeNull()
  })

  it('should run a function and reinterpret the return value', () => {
    const fakeFn = jest.fn()
    
    function myParaph() {
      return html`<p on-click=${fakeFn}>my paraph</p>`
    }

    const docFrag = html`<div>${myParaph}</div>`

    select(docFrag, 'p')?.dispatchEvent(new Event('click'))

    expect(select(docFrag, 'p')).not.toBeNull()
    expect(fakeFn).toHaveBeenCalled()
  })

  it('should parse html like text to html entities to html like strings', () => {
    const docFrag = html`<div>${'<p>should parse</p>'}</div>`
    
    expect(select(docFrag, 'p')).toBeNull()
    expect(select(docFrag, 'div')?.textContent).toBe('<p>should parse</p>')
  })

  it('should pass the html content if it is passed with raw tag function', () => {
    const input = '<p>should not parse</p>'
    const docFrag = html`<div>${raw`${input}`}</div>`
    
    expect(select(docFrag, 'p')?.textContent).toBe('should not parse')
  })

  it('should render values from a short boolean statement', () => {
    const value = true
    const docFrag = html`<div>${value && 'hello'}</div>`

    expect(select(docFrag, 'div')?.textContent).toBe('hello')
  })

  it('should not render the content if a short boolean statement not succeeds', () => {
    const value = false
    const docFrag = html`<section>${value && 'hello'}</section>`

    expect(select(docFrag, 'section')?.textContent).toBe('')
  })

  it('should parse correctly self closed custom elements tags', () => {
    const docFrag = html`
      <app-element />

      <app-section
        id="any_id"
        attr
      />

      <header>
        <app-icon />
        <h1>Titulo</h1>
      </header>
    `

    const appSection = select(docFrag, 'app-section')
    const appIcon = select(docFrag, 'app-icon')

    expect(appSection?.nextElementSibling).toEqual(select(docFrag, 'header'))
    expect(appIcon?.nextElementSibling).toEqual(select(docFrag, 'h1'))
  })
})
