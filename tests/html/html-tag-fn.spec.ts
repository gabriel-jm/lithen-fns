import { html, raw } from '@/index'

describe('html tag function', () => {
  it('should return a DocumentFragment with correct elements', () => {
    const docFrag = html`
      <p>Text</p>
      <div>
        <a href="#">link</a>
      </div>
    `

    expect(docFrag.querySelector('p')?.textContent).toBe('Text')
    expect(docFrag.querySelector('div')?.children[0]).toEqual(docFrag.querySelector('a'))
    expect(docFrag.querySelector('a')?.getAttribute('href')).toBe('#')
    expect(docFrag.querySelector('a')?.textContent).toBe('link')
  })

  it('should add all elements from an array', () => {
    const docFrag = html`
      <div>${[
        html`<p id="el-1">any text</p>`,
        html`<p id="el-2">any value</p>`
      ]}</div>
    `

    expect(docFrag.querySelector('#el-1')?.textContent).toBe('any text')
    expect(docFrag.querySelector('#el-2')?.textContent).toBe('any value')
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

    docFrag.querySelector('button')?.dispatchEvent(new Event('click'))
    docFrag.querySelector('input')?.dispatchEvent(new Event('input'))

    expect(fakeFn).toHaveBeenCalledTimes(2)
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

    expect(docFrag.querySelector('header > h1')).not.toBeNull()
    expect(docFrag.querySelector('footer > p')).not.toBeNull()
    expect(docFrag.querySelector('span')?.previousElementSibling)
      .toEqual(docFrag.querySelector('br'))
  })

  it('should run a function and reinterpret the return value', () => {
    const fakeFn = jest.fn()
    
    function myParaph() {
      return html`<p on-click=${fakeFn}>my paraph</p>`
    }

    const docFrag = html`<div>${myParaph}</div>`

    docFrag.querySelector('p')?.dispatchEvent(new Event('click'))

    expect(docFrag.querySelector('p')).not.toBeNull()
    expect(fakeFn).toHaveBeenCalled()
  })

  it('should parse html like text to html entities to html like strings', () => {
    const docFrag = html`<div>${'<p>should parse</p>'}</div>`
    
    expect(docFrag.querySelector('p')).toBeNull()
    expect(docFrag.querySelector('div')?.textContent).toBe('<p>should parse</p>')
  })

  it('should pass the html content if it is passed with raw tag function', () => {
    const input = '<p>should not parse</p>'
    const docFrag = html`<div>${raw`${input}`}</div>`
    
    expect(docFrag.querySelector('p')?.textContent).toBe('should not parse')
  })
})
