import { objectTypeResolvers } from '@/html/object-type-resolvers'
import { resolveValueForms } from '@/html/resolve-value-forms'
import { HtmlTemplateValue } from '@/html/html-template'

describe('ResolveValueForms', () => {
  const htmlStrings = ['any_strings']
  const resourceMaps = { elementsMap: {}, eventsMap: {} }
  const rawHtmlSymbol = Symbol()
  const index = 1

  describe('if type of value is object', () => {
    it('should call the correct objectTypeResolvers method', () => {
      const arrayMethodSpy = jest.spyOn(objectTypeResolvers, 'Array')
      const value = [document.createElement('p')]
      const elementId = `element-${index}`
  
      const response = resolveValueForms(
        htmlStrings,
        value,
        resourceMaps,
        rawHtmlSymbol,
        index
      )
  
      expect(response).toBe(`<template element-id="${elementId}"></template>`)
      expect(arrayMethodSpy).toHaveBeenCalledWith({
        value,
        resourceMaps,
        rawHtmlSymbol,
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
        value as unknown as HtmlTemplateValue,
        resourceMaps,
        rawHtmlSymbol,
        index
      )
  
      expect(response).toBe(JSON.stringify(value))
      expect(objectMethodSpy).toHaveBeenCalledWith({
        value,
        resourceMaps,
        rawHtmlSymbol,
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

      const expectedId = `event-${index}`

      const response = resolveValueForms(
        htmlStrings,
        value,
        resourceMaps,
        rawHtmlSymbol,
        index
      )

      expect(response).toBe(expectedId)
      expect(resourceMaps.eventsMap).toHaveProperty(expectedId, value)
    })
  })
})
