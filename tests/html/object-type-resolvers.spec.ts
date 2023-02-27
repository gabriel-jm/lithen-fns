import { objectTypeResolvers } from '@/html/object-type-resolvers'
import * as placeholders from '@/html/elements/add-element-placeholder'

describe('ObjectTypeResolvers', () => {
  const defaultParams = {
    htmlString: '<html></html>',
    value: 'any_value',
    resourcesMap: new Map(),
    index: 1
  }

  describe('ArrayOrDocumentFragment', () => {
    it('should add array of elements to elementsMap and return a template element string', () => {
      const divElement = document.createElement('div')
      const params = {
        ...defaultParams,
        value: [divElement]
      }
      const expectedElementId = `el="el-${params.index}"`

      const response = objectTypeResolvers.get('Array')!(params)

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
        const expectedElementId = `el="el-${params.index}"`
        
        const response = objectTypeResolvers.get('DocumentFragment')!(params)

        expect(response).toBe(`<template ${expectedElementId}></template>`)
        expect(params.resourcesMap.get(expectedElementId)).toEqual(
          documentFragment
        )
      }
    )
  })

  describe('Array() and DocumentFragment()', () => {
    it('should call ArrayOrDocumentFragment method with correct values', () => {
      const addElementPlaceholderSpy = vi.spyOn(placeholders, 'addElementPlaceholder')

      objectTypeResolvers.get('Array')!({ ...defaultParams, value: [] })

      expect(addElementPlaceholderSpy).toHaveBeenCalledWith(
        [],
        defaultParams.resourcesMap,
        defaultParams.index
      )

      const params = {
        ...defaultParams,
        value: [],
        index: 3
      }

      objectTypeResolvers.get('DocumentFragment')!(params)

      expect(addElementPlaceholderSpy).toHaveBeenCalledWith(
        [],
        params.resourcesMap,
        params.index
      )
    })
  })

  describe('Object()', () => {
    it('should return an undefined if the object value is not reconized', () => {
      const objectValue = {
        field: 'any_field'
      }
      
      const params = {
        ...defaultParams,
        value: objectValue
      }

      const response = objectTypeResolvers.get('Object')!(params)

      expect(response).toBeUndefined()
    })

    it('should add the value if it is a single element', () => {
      const div = document.createElement('div')

      const params = {
        ...defaultParams,
        value: div
      }

      const expectedElementId = `el="el-${params.index}"`

      const response = objectTypeResolvers.get('Object')!(params)

      expect(response).toBe(`<template ${expectedElementId}></template>`)
      expect(params.resourcesMap.get(expectedElementId)).toEqual(div)
    })

    it('should add the value if it is a single node', () => {
      const textNode = document.createTextNode('text')

      const params = {
        ...defaultParams,
        value: textNode
      }

      const expectedElementId = `el="el-${params.index}"`

      const response = objectTypeResolvers.get('Object')!(params)

      expect(response).toBe(`<template ${expectedElementId}></template>`)
      expect(params.resourcesMap.get(expectedElementId)).toEqual(textNode)
    })

    it('should return an empty string if a null value is passed', () => {
      const params = {
        ...defaultParams,
        value: null as any
      }

      const response = objectTypeResolvers.get('Object')!(params)

      expect(response).toBe('')
    })
  })
})
