import { raw } from '@/index.js'

describe('RawHTML tag function', () => {
  it('should accept a single value in normal function call', () => {
    const html = raw('<p>text</p>', '<span></span>')

    expect(html.children[0].outerHTML).toBe('<p>text</p>')
    expect(html.children[1].outerHTML).toBe('<span></span>')
  })
})
