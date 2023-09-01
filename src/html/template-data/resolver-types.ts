export type TemplateData<T = unknown> = {
  currentHTML: string
  resources: Map<string, unknown>
  hash: string
  index: number
  data: T
}

export type Resolver<T = unknown> = (value: TemplateData<T>) => string | unknown
