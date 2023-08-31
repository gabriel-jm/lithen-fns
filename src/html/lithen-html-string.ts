export class LithenHTMLString extends String {
  constructor(data: string, public resources?: Map<string, unknown>) {
    super(data)
  }
}
