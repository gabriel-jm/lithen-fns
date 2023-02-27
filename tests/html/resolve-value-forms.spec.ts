import { objectTypeResolvers } from '@/html/object-type-resolvers'
import { resolveValueForms } from '@/html/resolve-value-forms'

describe('ResolveValueForms', () => {
  const htmlString = 'any_string'
  const resourcesMap = new Map()
  const index = 1

  describe('if type of value is object', () => {
    it('should call the correct objectTypeResolvers method', () => {
      const value = [document.createElement('p')]
      const elementId = `el-${index}`
      const arrayResolverSpy = vi.fn(() => `<template el="${elementId}"></template>`)
      const getMethodSpy = vi.spyOn(objectTypeResolvers, 'get')
        .mockImplementationOnce(() => arrayResolverSpy)
  
      const response = resolveValueForms(
        htmlString,
        value,
        resourcesMap,
        index
      )
  
      expect(getMethodSpy).toHaveBeenCalledWith('Array')
      expect(arrayResolverSpy).toHaveBeenCalledWith({
        htmlString,
        value,
        resourcesMap,
        index
      })
      expect(response).toBe(`<template el="${elementId}"></template>`)
    })
  
    it('should call the Object method from objectTypeResolvers if value is from a unknown class', () => {
      const objectResolverSpy = vi.fn()
      const getMethodSpy = vi.spyOn(objectTypeResolvers, 'get')
        .mockImplementationOnce(() => undefined)
        .mockImplementationOnce(() => objectResolverSpy)
  
      class UnknownClass {
        field = 'any_field'
      }
  
      const value = new UnknownClass()
  
      const response = resolveValueForms(
        htmlString,
        value,
        resourcesMap,
        index
      )
  
      expect(response).toBe(value.toString())
      expect(getMethodSpy).toHaveBeenNthCalledWith(2, 'Object')
      expect(objectResolverSpy).toHaveBeenCalledWith({
        htmlString,
        value,
        resourcesMap,
        index
      })
    })
  })

  describe('if type of value is function', () => {
    it('should add the value to the eventsMap if previous html string pass o event regex', () => {
      const htmlString = '<tag on-click='
      const value = () => null
      const resourcesMap = new Map()
      const index = 0

      const expectedId = `evt-${index}`

      const response = resolveValueForms(
        htmlString,
        value,
        resourcesMap,
        index
      )

      expect(response).toBe(`"${expectedId}"`)
      expect(resourcesMap.get(`on-click="${expectedId}"`)).toEqual(value)
    })

    it('should parse the function as a string value', () => {
      const htmlString = '<p>any_value</p>'
      const value = () => 'any_value'
      const resourceMaps = new Map()
      const index = 0

      const response = resolveValueForms(
        htmlString,
        value,
        resourcesMap,
        index
      )

      expect(response).toBe('() =&gt; "any_value"')
      expect(resourceMaps).not.toHaveProperty('evt-0')
    })
  })

  describe('if type of value is string', () => {
    it('should replace < and > to the respective html entity', () => {
      const value = '<input />'

      const response = resolveValueForms(
        htmlString,
        value,
        resourcesMap,
        index
      )

      expect(response).toBe('&lt;input /&gt;')
    })

    it('should remove the javascript: string', () => {
      const value = 'href://javascript:void'

      const response = resolveValueForms(
        htmlString,
        value,
        resourcesMap,
        index
      )

      expect(response).toBe('href://void')
    })

    it('should return an empty string if value is null', () => {
      const value = null

      const response = resolveValueForms(
        htmlString,
        value,
        resourcesMap,
        index
      )

      expect(response).toBe('')
    })

    it('should return an empty string if value is undefined', () => {
      const value = undefined

      const response = resolveValueForms(
        htmlString,
        value,
        resourcesMap,
        index
      )

      expect(response).toBe('')
    })

    it('should return an empty string if value is false', () => {
      const value = false

      const response = resolveValueForms(
        htmlString,
        value,
        resourcesMap,
        index
      )

      expect(response).toBe('')
    })

    it('should return the correct string if value is zero', () => {
      const value = 0

      const response = resolveValueForms(
        htmlString,
        value,
        resourcesMap,
        index
      )

      expect(response).toBe('0')
    })
  })
})
