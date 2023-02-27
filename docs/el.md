# Lithen Tag Functions - el

`el` is a tagged template function that works just like the `html` function. But returns only
the first element.

Previously used with `html.first`.

It returns a `ChildNode`, the first element of the document fragment created by the `html` tag 
function.

## Usage
```ts
const value = 10

el`
  <div>Value: ${value}</div>
`
// or
el(['<div>Value: ','</div>'], value)
```
