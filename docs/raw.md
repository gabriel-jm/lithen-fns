# Rendering Tag Functions - raw

`raw` is a tagged template function that is similiar to the [`html`](./html.md) but without passing in the XSS analisys. Its util when you don't want the passed html doesn't be transformed by the XSS analisys.

## Returns
`html` - type string - the parsed html text.

## Usage
```ts
raw`
  <div>...</div>
`
// or
raw(['<div>...</div>'])
```
