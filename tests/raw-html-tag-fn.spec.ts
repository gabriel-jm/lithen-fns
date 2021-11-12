import { raw } from '@/index'

describe('RawHTML tag function', () => {
  it('should return a minified html text', () => {
    const html = raw`
      <section>
        ${'<p>Text</p>'}
      </section>
      <div>${100}</div>
    `

    expect(html.toString()).toBe('<section><p>Text</p></section><div>100</div>')
  })

  it('should accept a single value in normal function call', () => {
    const html = raw('<p>text</p>', '<span></span>')

    expect(html.toString()).toBe('<p>text</p><span></span>')
  })
})
