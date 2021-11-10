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
})
