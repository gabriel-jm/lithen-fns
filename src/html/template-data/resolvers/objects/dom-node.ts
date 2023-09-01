import { TemplateData } from '../../resolver-types.js'

export function resolveDOMNode(value: TemplateData) {
  if (!(value.data instanceof Node)) return

  const { hash, index, data, resources } = value
  const nodeId = `nd="${hash}-${index}"`
  resources.set(nodeId, data)

  return `<template ${nodeId}></template>`
}
