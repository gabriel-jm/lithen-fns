import { ResourcesMap } from '../html-tag-fn.js'

export function addElementPlaceholder(
  element: Node | (Node | string)[],
  resourcesMap: ResourcesMap,
  index: number
) {
  const elementId = `el="el-${index}"`
  resourcesMap.set(elementId, element)

  return `<template ${elementId}></template>`
}
