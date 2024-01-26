import { TemplateData } from '../resolver-types.js'

const eventOnEndRegex = /.*\s(on-[\w\-]+)=$/s
const shellSignalRegex = /.*<shell>\s*$/

export function resolveFunctionValue(value: TemplateData) {
  const { currentHTML, resources, index, data } = value

  if (typeof data !== 'function') return

  const match = currentHTML.match(eventOnEndRegex)

  if (match) {
    const eventType = match[1]
    const eventId = `"${index}"`
    const eventKey = `${eventType}=${eventId}`

    resources.set(eventKey, data)

    return eventId
  }

  const shellMatch = currentHTML.match(shellSignalRegex)

  if (shellMatch) {
    const signalId = index
    const shellSignalId = `shell-signal="${signalId}"`
    
    resources.set(shellSignalId, data)

    return `<template ${shellSignalId}></template>`
  }
}
