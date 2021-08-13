# Rendering Tag Functions - htmlFrag

`htmlFrag` is a tagged template function that is similiar to the [`html`](./html.md), but it returns a DocumentFragment instead of a html string.

## Returns
`DocumentFragment` - type object - a DocumentFragment containing the passed html as elements.

## Usage
```ts
htmlFrag`
  <div>...</div>
`
// or
htmlFrag(['<div>...</div>'])
```
