import { htmlStringParser } from '@/html/html-string-parser'

describe('htmlStringParser', () => {
  describe('Spaces around', () => {
    it('should remove any space or line break around the html string', () => {
      const html = `
        <span></span> 
      `

      const result = htmlStringParser(html)

      expect(result).toBe('<span></span>')
    })
  })

  describe('Custom elements tags', () => {
    it('should replicated the tag if it is set as a self closed', () => {
      const html = '<app-element />'

      const result = htmlStringParser(html)

      expect(result).toBe('<app-element></app-element>')
    })

    it('should keep the attributes when replicate elements tag', () => {
      const html = '<x-name disabled label="Name" />'

      const result = htmlStringParser(html)

      expect(result).toBe('<x-name disabled label="Name"></x-name>')
    })
  })

  describe('Slot elements', () => {
    it('should replicate the tag if it is set as a self closed', () => {
      const html = '<slot />'

      const result = htmlStringParser(html)

      expect(result).toBe('<slot></slot>')
    })

    it('should keep the attributes when replicates slot tag', () => {
      const html = '<slot name="slot-name" />'

      const result = htmlStringParser(html)

      expect(result).toBe('<slot name="slot-name"></slot>')
    })
  })

  describe('Spaces within', () => {
    it('should remove any space or line break within the html string', () => {
      const html = `
        <span
          class="span"
        >
        </span>
          
        <input />
      `

      const result = htmlStringParser(html)

      expect(result).toBe('<span class="span"></span><input />')
    })

    it('should remove spaces between elements', () => {
      const html = '<input />  <img /> <a></a>   <input />'

      const result = htmlStringParser(html)

      expect(result).toBe('<input /><img /><a></a><input />')
    })

    it('should reduce all spaces greater then one within tags to only one', () => {
      const html = `
        <span
             class="span"
          id="span"
        >
          Text with   spaces
        </span>
          
        <input   name="username"   />
      `

      const result = htmlStringParser(html)

      expect(result).toBe(
        '<span class="span" id="span">Text with   spaces</span><input name="username" />'
      )
    })
  })
})
