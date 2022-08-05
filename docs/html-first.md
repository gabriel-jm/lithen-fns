# Lithen Tag Functions - html.first

`html.first` is a tagged template function that works just like the `html` function.

## Returns
`Element` - type object - the first element of the document fragment created by the `html` tag function.

## Usage
```ts
html.first`
  <div>...</div>
`
// or
html.first(['<div>...</div>'], 'values')
```
