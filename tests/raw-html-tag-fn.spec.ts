import { raw } from '@/index.js'

describe('RawHTML tag function', () => {
  it('should return a minified html text', () => {
    const html1 = raw`
      <section>
        ${'<p>Text</p>'}
      </section>
      <div>${100}</div>
    `

    const html2 = raw`
      <span
        class="any-class"
        attr
        tabindex="0"
      >
        Text
      </span>
    `

    const html3 = raw`
      <header>
        <ul>
          <li>
            A bigger text
          </li>
        </ul>
      </header>
    `

    expect(html1.toString()).toBe(`
      <section><p>Text</p></section><div>100</div>
    `.trim())
    expect(html2.toString()).toBe(`
      <span class="any-class" attr tabindex="0" >Text</span>
    `.trim())
    expect(html3.toString()).toBe(`
      <header><ul><li>A bigger text</li></ul></header>
    `.trim())
  })

  it('should accept a single value in normal function call', () => {
    const html = raw('<p>text</p>', '<span></span>')

    expect(html.toString()).toBe('<p>text</p><span></span>')
  })
})
