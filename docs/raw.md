# Lithen Functions - raw

`raw` is a tagged template function that is used to by pass in the `html` tag function XSS analysis.
This tag function is normally used for specifics situations. For example when you need a raw html
input from the user, when using the `html` tag function any input that has the `<`, `>` and `/` 
symbols get parsed to the corresponding HTML Entities.

It works and has the same features as the `html` tag function and also returns a `DocumentFragment`
instance.

## Warning
Use it with caution, it can lead to unwanted XSS attacks.

## Usage

```ts
raw('<div>...</div>')

// or

raw`
  <div>...</div>
`
```
