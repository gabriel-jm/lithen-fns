import { ResourcesMap } from '../html-tag-fn.js'

export type TemplateData<T = unknown> = {
  currentHTML: string
  resources: ResourcesMap
  index: number
  data: T
}

export type Resolver<T = unknown> = (value: TemplateData<T>) => string | unknown
