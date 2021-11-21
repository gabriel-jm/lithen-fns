import { objectTypeResolvers } from '@/html/object-type-resolvers'
import { resolveValueForms } from '@/html/resolve-value-forms'
import { HtmlTagFnValue } from '@/html/html-tag-fn'

describe('ResolveValueForms', () => {
  const htmlStrings = ['any_strings']
  const resourceMaps = { elementsMap: {}, eventsMap: {} }
  const tagFnsSymbols = [Symbol(), Symbol()] as const
  const index = 1

  describe('if type of value is object', () => {
    it('should call the correct objectTypeResolvers method', () => {
      const arrayMethodSpy = jest.spyOn(objectTypeResolvers, 'Array')
      const value = [document.createElement('p')]
      const elementId = `elm-${index}`
  
      const response = resolveValueForms(
        htmlStrings,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )
  
      expect(response).toBe(`<template element-id="${elementId}"></template>`)
      expect(arrayMethodSpy).toHaveBeenCalledWith({
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      })
    })
  
    it('should call the Object method from objectTypeResolvers if value is from a unknown class', () => {
      const objectMethodSpy = jest.spyOn(objectTypeResolvers, 'Object')
  
      class UnknownClass {
        field = 'any_field'
      }
  
      const value = new UnknownClass()
  
      const response = resolveValueForms(
        htmlStrings,
        value as unknown as HtmlTagFnValue,
        resourceMaps,
        tagFnsSymbols,
        index
      )
  
      expect(response).toBe(JSON.stringify(value))
      expect(objectMethodSpy).toHaveBeenCalledWith({
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      })
    })
  })

  describe('if type of value is function', () => {
    it('should add the value to the eventsMap if previous html string pass o event regex', () => {
      const htmlStrings = [' on-click=']
      const value = () => null
      const resourceMaps = {
        elementsMap: {},
        eventsMap: {}
      }
      const index = 0

      const expectedId = `evt-${index}`

      const response = resolveValueForms(
        htmlStrings,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe(expectedId)
      expect(resourceMaps.eventsMap).toHaveProperty(expectedId, value)
    })

    it('should execute the function and call resolveValueForms again with the result', () => {
      const htmlStrings = ['<p>any_value</p>']
      const value = () => 'any_value'
      const resourceMaps = {
        elementsMap: {},
        eventsMap: {}
      }
      const index = 0

      const response = resolveValueForms(
        htmlStrings,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe('any_value')
      expect(resourceMaps.eventsMap).not.toHaveProperty('evt-0')
    })
  })

  describe('if type of value is string', () => {
    it('should replace < and > to the respective html entity', () => {
      const value = '<input />'

      const response = resolveValueForms(
        htmlStrings,
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
        htmlStrings,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe('href://void')
    })

    it('should return an empty string if value is falsy', () => {
      const value = false

      const response = resolveValueForms(
        htmlStrings,
        value,
        resourceMaps,
        tagFnsSymbols,
        index
      )

      expect(response).toBe('')
    })
  })
})
