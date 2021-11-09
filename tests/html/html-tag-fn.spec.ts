import { html } from '@/index'

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
})
