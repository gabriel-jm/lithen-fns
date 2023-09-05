import { DataSignal } from '../../../index.js'
import { ResolverChain } from '../../pipe-resolvers.js'
import { TemplateData } from '../../resolver-types.js'

const resolverChain = new ResolverChain(
  resolveAttributeSignal,
  resolveTextSignal
)

export function resolveSignal(value: TemplateData) {
  if (!(value.data instanceof DataSignal)) return

  return resolverChain.pipe(value) 
}

function resolveTextSignal(value: TemplateData<DataSignal<unknown>>) {
  const { currentHTML, index, resources, data } = value

  const isInsideTag = checkIsInsideTag(currentHTML)

  if (!isInsideTag) return

  const signalId = `text-sig="${index}"`
  resources.set(signalId, data)

  return `<template ${signalId}></template>`
}

const attributeRegex = /.*\s([\w-]+)=$/

function resolveAttributeSignal(value: TemplateData<DataSignal<unknown>>) {
  const { currentHTML, index, resources, data } = value

  const match = currentHTML.match(attributeRegex)

  if (match) {
    const attributeName = match[1]
    const signalId = `"${index}"`
    resources.set(`sig-attr-${attributeName}=${signalId}`, data)
    return signalId
  }
}

function checkIsInsideTag(html: string) {
  for (let i=html.length-1; i>0; i-=1) {
    const letter = html.at(i)

    if (letter === undefined) return false

    if (letter === '>') return true

    if (letter === '<') return false
  }
}
