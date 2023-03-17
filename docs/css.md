# Lithen Functions - css

`css` is a tag function that minifies a provided css string. It also can be used to create "scoped" 
styles.

It returns an instance of `LithenCSSText` with the parsed css text as content. In its intantiation 
the class verifies if there is a `&` symbol in the css code and replaces it for random hash class. 
The hash class always starts with the letter `e` and only creates the hash and make the replacement 
if there is some `&` in code.

We call it "scoped" because it makes fell like it is scoped but in fact it only creates a
random class to prevent collisions and make it unique.

To attach the styles created with `&` to an element you must set it to the `css` attribute.
```ts
const styles = css`
  & {
    background-color: #45d;
    padding: 12px;
    border-radius: 4px;
  }
`

html`
  <div css=${styles}>
    My content
  </div>
`
```

## Warning
The feature of the `&` was something created thinking to work without `ShadowDOM`, because shadow DOM
already has a scoped css feature.

## Usage
```ts
css`
  .any_class { ... }
`
// or
css(['.any_class { ... }'])
```
