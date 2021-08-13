# Rendering Tag Functions - rawFrag

`rawFrag` is a tagged template function that its like the [`htmlFrag`](./html-frag.md) but using the [`raw`](./raw.md) function instead.

## Returns
`DocumentFragment` - type object - a DocumentFragment containing the passed html as elements.

## Usage
```ts
rawFrag`
  <div>...</div>
`
// or
rawFrag(['<div>...</div>'])
```
