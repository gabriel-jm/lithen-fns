import { objectTypeResolvers } from '@/html/object-type-resolvers'
import { TagFnString } from '@/html/html-tag-fn'
import { html, raw } from '@/index'

describe('ObjectTypeResolvers', () => {
  const defaultParams = {
    htmlString: '<html></html>',
    value: 'any_value',
    tagFnsSymbols: [Symbol(), Symbol()] as const,
    resourcesMap: new Map(),
    index: 1
  }

  describe('String()', () => {
    it('should return the exact value if it is a RawHTMLString', () => {
      const value: TagFnString = Object.assign(new String('<html></html>'), {
        tagSymbol: defaultParams.tagFnsSymbols[0]
      })

      const response = objectTypeResolvers.String({
        ...defaultParams,
        value
      })

      expect(response.toString()).toBe('<html></html>')
    })

    it('should return an empty string if value is not a RawHTMLString', () => {
      const response = objectTypeResolvers.String(defaultParams)

      expect(response).toBe('')
    })
  })

  describe('ArrayOrDocumentFragment', () => {
    it('should add array of elements to elementsMap and return a template element string', () => {
      const divElement = document.createElement('div')
      const params = {
        ...defaultParams,
        value: [divElement]
      }
      const expectedElementId = `elm-id="elm-${params.index}"`

      const response = objectTypeResolvers.ArrayOrDocumentFragment(params)

      expect(response).toBe(`<template ${expectedElementId}></template>`)
      expect(params.resourcesMap.get(expectedElementId)).toEqual(
        params.value
      )
    })

    it(
      'should add DocumentFragment childNodes to elementsMap and return a template element string',
      () => {
        const templateElement = document.createElement('template')
        templateElement.innerHTML = `<span></span><input/>`
        const documentFragment = templateElement.content.cloneNode(true) as DocumentFragment

        const params = {
          ...defaultParams,
          value: documentFragment,
          index: 2
        }
        const expectedElementId = `elm-id="elm-${params.index}"`
        
        const response = objectTypeResolvers.ArrayOrDocumentFragment(params)

        expect(response).toBe(`<template ${expectedElementId}></template>`)
        expect(params.resourcesMap.get(expectedElementId)).toEqual(
          documentFragment
        )
      }
    )
  })

  describe('Array() and DocumentFragment()', () => {
    it('should call ArrayOrDocumentFragment method with correct values', () => {
      const arrayOrDocumentFragmentSpy = vi.spyOn(objectTypeResolvers, 'ArrayOrDocumentFragment')

      objectTypeResolvers.Array({ ...defaultParams, value: [] })

      expect(arrayOrDocumentFragmentSpy).toHaveBeenCalledWith({ ...defaultParams, value: [] })

      const params = {
        ...defaultParams,
        value: [],
        index: 3
      }

      objectTypeResolvers.DocumentFragment(params)

      expect(arrayOrDocumentFragmentSpy).toHaveBeenCalledWith(params)
    })
  })

  describe('Array()', () => {
    it('should call String type resolver if value in array is an instance of String', () => {
      const StringSpy = vi.spyOn(objectTypeResolvers, 'String')
      const divElement = document.createElement('div')

      objectTypeResolvers.Array({
        ...defaultParams,
        value: [
          raw`<a href="#">ancor</a>`,
          divElement,
          html`<strong>Strong</strong>`
        ]
      })

      expect(StringSpy).toHaveBeenCalledWith({
        ...defaultParams,
        value: raw`<a href="#">ancor</a>`
      })
    })
  })

  describe('Object()', () => {
    it('should return a JSON if the object value is not a EventListenerObject', () => {
      const objectValue = {
        field: 'any_field'
      }
      
      const params = {
        ...defaultParams,
        value: objectValue
      }

      const response = objectTypeResolvers.Object(params)

      expect(response).toBe(objectValue.toString())
    })

    it('should add an array with the value if it is a single element', () => {
      const div = document.createElement('div')

      const params = {
        ...defaultParams,
        value: div
      }

      const expectedElementId = `elm-id="elm-${params.index}"`

      const response = objectTypeResolvers.Object(params)

      expect(response).toBe(`<template ${expectedElementId}></template>`)
        expect(params.resourcesMap.get(expectedElementId)).toEqual(
          [div]
        )
    })

    it('should add an array with the value if it is a single node', () => {
      const textNode = document.createTextNode('text')

      const params = {
        ...defaultParams,
        value: textNode
      }

      const expectedElementId = `elm-id="elm-${params.index}"`

      const response = objectTypeResolvers.Object(params)

      expect(response).toBe(`<template ${expectedElementId}></template>`)
        expect(params.resourcesMap.get(expectedElementId)).toEqual(
          [textNode]
        )
    })

    it('should return an empty string if a null value is passed', () => {
      const params = {
        ...defaultParams,
        value: null as any
      }

      const response = objectTypeResolvers.Object(params)

      expect(response).toBe('')
    })
  })
})
