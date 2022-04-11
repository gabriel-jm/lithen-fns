import { objectTypeResolvers } from '@/html/object-type-resolvers'
import { TagFnString } from '@/html/html-tag-fn'

describe('ObjectTypeResolvers', () => {
  const defaultParams = {
    value: 'any_value',
    tagFnsSymbols: [Symbol(), Symbol()] as const,
    resourceMaps: {
      elementsMap: {},
      eventsMap: {}
    },
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
      const expectedElementId = `elm-${params.index}`

      const response = objectTypeResolvers.ArrayOrDocumentFragment(params)

      expect(response).toBe(`<template element-id="${expectedElementId}"></template>`)
      expect(params.resourceMaps.elementsMap).toHaveProperty(
        expectedElementId,
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
        const expectedElementId = `elm-${params.index}`
        
        const response = objectTypeResolvers.ArrayOrDocumentFragment(params)

        expect(response).toBe(`<template element-id="${expectedElementId}"></template>`)
        expect(params.resourceMaps.elementsMap).toHaveProperty(
          expectedElementId,
          documentFragment
        )
      }
    )
  })

  describe('Array() and DocumentFragment()', () => {
    it('should call ArrayOrDocumentFragment method with correct values', () => {
      const arrayOrDocumentFragmentSpy = jest.spyOn(objectTypeResolvers, 'ArrayOrDocumentFragment')

      objectTypeResolvers.Array(defaultParams)

      expect(arrayOrDocumentFragmentSpy).toHaveBeenCalledWith(defaultParams)

      const params = {
        ...defaultParams,
        value: [],
        index: 3
      }

      objectTypeResolvers.DocumentFragment(params)

      expect(arrayOrDocumentFragmentSpy).toHaveBeenCalledWith(params)
    })
  })

  describe('Object()', () => {
    it('should add the object to eventsMap if it is a EventListenerObject and return event id', () => {
      const eventListener = {
        handleEvent() {}
      }
      const expectedEventId = `evt-${defaultParams.index}`
      const params = {
        ...defaultParams,
        value: eventListener
      }

      const response = objectTypeResolvers.Object(params)

      expect(response).toBe(`"${expectedEventId}"`)
      expect(params.resourceMaps.eventsMap).toHaveProperty(expectedEventId, eventListener)
    })

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

      const expectedElementId = `elm-${params.index}`

      const response = objectTypeResolvers.Object(params)

      expect(response).toBe(`<template element-id="${expectedElementId}"></template>`)
        expect(params.resourceMaps.elementsMap).toHaveProperty(
          expectedElementId,
          [div]
        )
    })

    it('should add an array with the value if it is a single node', () => {
      const textNode = document.createTextNode('text')

      const params = {
        ...defaultParams,
        value: textNode
      }

      const expectedElementId = `elm-${params.index}`

      const response = objectTypeResolvers.Object(params)

      expect(response).toBe(`<template element-id="${expectedElementId}"></template>`)
        expect(params.resourceMaps.elementsMap).toHaveProperty(
          expectedElementId,
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
