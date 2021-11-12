# Lithen Tag Functions - raw

`raw` is a tagged template function that is used to by pass in the html tag function XSS analysis.
This tag function is normally used for specifics strings, like in situations the is intectionally
passed html text as value. But is normally recommended to use the html tag function. <br />
This function can be called with a single value.

## Returns
`html` - type string - the parsed html text.

## Usage

```ts
raw`
  <div>...</div>
`
// or
raw('<div>...</div>')
```
