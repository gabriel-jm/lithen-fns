import { objectTypeResolvers } from '@/html/object-type-resolvers'
import { resolveValueForms } from '@/html/resolve-value-forms'

describe('ResolveValueForms', () => {
  it('should call a objectTypeResolvers method if value received is an object', () => {
    const objectMethodSpy = jest.spyOn(objectTypeResolvers, 'Object')
    const value = { field: 'any_field' }
    const resourceMaps = { elementsMap: {}, eventsMap: {} }
    const rawHtmlSymbol = Symbol()
    const index = 1

    resolveValueForms(['any_strings'], value, resourceMaps, rawHtmlSymbol, index)

    expect(objectMethodSpy).toHaveBeenCalledWith({
      value,
      resourceMaps,
      rawHtmlSymbol,
      index
    })
  })
})
