export class LithenCSSText extends String {
  #hash
  
  constructor(data: string) {
    const hash = `e${genRandomHash()}`
    super(
      data.includes('&')
      ? data.replace(/&/g, `.${hash}`)
      : data
    )

    this.#hash = hash
  }

  get hash() {
    return this.#hash
  }
}

function genRandomHash() {
  return crypto.getRandomValues(new Uint8Array(3))
    .reduce((acc, value) => acc + value.toString(32), '')
}
