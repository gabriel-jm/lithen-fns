/**
 * Class used to represent a CSS text created by the `css`
 * tag function. It also replaces any `&` with a random hash class
 * created on its instantiation, used to avoid a CSS class
 * collision and give an impression of scoped styles.
 */
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

  /**
   * @returns The random hash class, every class starts with
   * the letter "e".
   */
  get hash() {
    return this.#hash
  }
}

function genRandomHash() {
  return crypto.getRandomValues(new Uint8Array(3))
    .reduce((acc, value) => acc + value.toString(32), '')
}
