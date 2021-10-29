import { objectTypeResolvers } from '@/html/object-type-resolvers'

describe('ObjectTypeResolvers', () => {
  const defaultParams = {
    value: 'any_value',
    rawHtmlSymbol: Symbol(),
    resourceMaps: {
      elementsMap: {},
      eventsMap: {}
    },
    index: 1
  }

  describe('String()', () => {
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
      const expectedElementId = `element-${params.index}`

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
        const expectedElementId = `element-${params.index}`
        
        const response = objectTypeResolvers.ArrayOrDocumentFragment(params)

        expect(response).toBe(`<template element-id="${expectedElementId}"></template>`)
        expect(params.resourceMaps.elementsMap).toHaveProperty(
          expectedElementId,
          documentFragment.childNodes
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
      const expectedEventId = `event-${defaultParams.index}`
      const params = {
        ...defaultParams,
        value: eventListener
      }

      const response = objectTypeResolvers.Object(params)

      expect(response).toBe(expectedEventId)
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

      expect(response).toBe(JSON.stringify(objectValue))
    })
  })
})
