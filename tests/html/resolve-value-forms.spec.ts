import { objectTypeResolvers } from '@/html/object-type-resolvers'
import { resolveValueForms } from '@/html/resolve-value-forms'
import { HtmlTagFnValue } from '@/html/html-tag-fn'

describe('ResolveValueForms', () => {
  const htmlString = 'any_string'
  const resourceMaps = {
    elementsMap: new Map(),
    eventsMap: new Map(),
    refsMap: new Map()
  }
  const tagFnsSymbols = [Symbol(), Symbol()] as const
  const index = 1

  describe('if type of value is object', () => {
    it('should call the correct objectTypeResolvers method', () => {
      const arrayMethodSpy = vi.spyOn(objectTypeResolvers, 'Array')
      const value = [document.createElement('p')]
      const elementId = `elm-${index}`
  
      const response = resolveValueForms(
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )
  
      expect(response).toBe(`<template elm-id="${elementId}"></template>`)
      expect(arrayMethodSpy).toHaveBeenCalledWith({
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      })
    })
  
    it('should call the Object method from objectTypeResolvers if value is from a unknown class', () => {
      const objectMethodSpy = vi.spyOn(objectTypeResolvers, 'Object')
  
      class UnknownClass {
        field = 'any_field'
      }
  
      const value = new UnknownClass()
  
      const response = resolveValueForms(
        htmlString,
        value as unknown as HtmlTagFnValue,
        resourceMaps,
        tagFnsSymbols,
        index
      )
  
      expect(response).toBe(value.toString())
      expect(objectMethodSpy).toHaveBeenCalledWith({
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      })
    })
  })

  describe('if type of value is function', () => {
    it('should add the value to the eventsMap if previous html string pass o event regex', () => {
      const htmlString = '<tag on-click='
      const value = () => null
      const resourceMaps = {
        elementsMap: new Map(),
        eventsMap: new Map(),
        refsMap: new Map()
      }
      const index = 0

      const expectedId = `evt-${index}`

      const response = resolveValueForms(
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe(`"${expectedId}"`)
      expect(resourceMaps.eventsMap.get(`on-click="${expectedId}"`)).toEqual(value)
    })

    it('should parse the function as a string value', () => {
      const htmlString = '<p>any_value</p>'
      const value = () => 'any_value'
      const resourceMaps = {
        elementsMap: new Map(),
        eventsMap: new Map(),
        refsMap: new Map()
      }
      const index = 0

      const response = resolveValueForms(
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe('() =&gt; "any_value"')
      expect(resourceMaps.eventsMap).not.toHaveProperty('evt-0')
    })
  })

  describe('if type of value is string', () => {
    it('should replace < and > to the respective html entity', () => {
      const value = '<input />'

      const response = resolveValueForms(
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe('&lt;input /&gt;')
    })

    it('should remove the javascript: string', () => {
      const value = 'href://javascript:void'

      const response = resolveValueForms(
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe('href://void')
    })

    it('should return an empty string if value is null', () => {
      const value = null

      const response = resolveValueForms(
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe('')
    })

    it('should return an empty string if value is undefined', () => {
      const value = undefined

      const response = resolveValueForms(
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe('')
    })

    it('should return an empty string if value is false', () => {
      const value = false

      const response = resolveValueForms(
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe('')
    })

    it('should return the correct string if value is zero', () => {
      const value = 0

      const response = resolveValueForms(
        htmlString,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe('0')
    })
  })
})
