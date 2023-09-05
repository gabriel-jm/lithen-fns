import { ResourcesMap } from '../html-tag-fn.js'

export function addElementPlaceholder(
  element: Node | (Node | string)[],
  resources: ResourcesMap,
  index: number
) {
  const elementId = `el="${index}"`
  resources.set(elementId, element)

  return `<template ${elementId}></template>`
}
