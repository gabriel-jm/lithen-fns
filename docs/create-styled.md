# Lithen Tag Functions - createStyled

`createStyled` is a helper function to create an element already bond to specific styles with the `&`
symbol. Just like we did in the `html` or `el` tag functions with the `css` attribute.

See more about `&` symbol in [css tag function](./css.md) docs.

It returns the element with the random hash class generated.

## Usage

It receives two parameters the element's tag name and an instance of `LithenCSSText`.

```ts
const contentContainer = createStyled('section', css`
  & {
    max-width: 1300px;
    padding: 0 12px;
  }
`)
```
