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

      expect(result).toBe('<app-element ></app-element>')
    })

    it('should keep the attributes when replicate elements tag', () => {
      const html = '<x-name disabled label="Name" />'

      const result = htmlStringParser(html)

      expect(result).toBe('<x-name disabled label="Name"></x-name>')
    })

    it('should replicate the tag even if has break lines', () => {
      const html = `
        <app-element
          attr="any_value"
        />
      `

      const result = htmlStringParser(html)

      expect(result).toBe('<app-element attr="any_value"></app-element>')
    })
  })

  describe('Slot elements', () => {
    it('should replicate the tag if it is set as a self closed', () => {
      const html = '<slot />'

      const result = htmlStringParser(html)

      expect(result).toBe('<slot ></slot>')
    })

    it('should keep the attributes when replicates slot tag', () => {
      const html = '<slot name="slot-name" />'

      const result = htmlStringParser(html)

      expect(result).toBe('<slot name="slot-name"></slot>')
    })
  })
})
