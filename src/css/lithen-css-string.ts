/**
 * Class used to represent a CSS text created by the `css`
 * tag function. It also replaces any `&` with a random hash class
 * created on its instantiation, used to avoid a CSS class
 * collision and give an impression of scoped styles.
 */
export class LithenCSSString extends String {
  constructor(data: string) {
    super(data)
  }
}
