import { LithenHTMLString } from '../../lithen-html-string.js'
import { pipeResolvers } from '../pipe-resolvers.js'
import { TemplateData } from '../resolver-types.js'

export function resolveObjectValue(value: TemplateData) {
  if (typeof value.data !== 'object') return

  return pipeResolvers(
    value,
    resolveLithenHTMLString,
    resolveDOMNode,
    resolveArray
  )
}

function resolveLithenHTMLString(value: TemplateData) {  
  if (value.data instanceof LithenHTMLString) {
    value.resources = new Map([
      ...value.resources,
      ...value.data.resources ?? []
    ])

    return value.data.toString()
  }
}

function resolveDOMNode(value: TemplateData) {
  if (!(value.data instanceof Node)) return

  const { hash, index, data, resources } = value
  const nodeId = `nd="${hash}-${index}"`
  resources.set(nodeId, data)

  return `<template ${nodeId}></template>`
}

function resolveArray(value: TemplateData) {
  if (!Array.isArray(value.data)) return
  
  const { data: dataList, index } = value

  let internalNodeCount = 1

  return dataList.reduce((acc, data) => {
    if (data instanceof LithenHTMLString) {
      return resolveLithenHTMLString(value)
    }

    if (data instanceof Node) {
      const resolvedNode = resolveDOMNode({
        ...value,
        index: index + internalNodeCount,
        data
      })

      internalNodeCount++

      return acc + resolvedNode
    }

    return acc + String(data)
  }, '')
}
