export type TemplateData<T = unknown> = {
  currentHTML: string
  resources: Map<string, unknown>
  index: number
  data: T
}

export type Resolver<T = unknown> = (value: TemplateData<T>) => string | unknown
