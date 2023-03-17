# Lithen Functions - raw

`raw` is a tagged template function that is used to by pass in the html tag function XSS analysis.
This tag function is normally used for specifics strings, like in situations the is intectionally
passed html text as value. But is normally recommended to use the html tag function. <br />
This function can be called with a single value.

It returns an instance of `LithenRawHTMLText` with the parsed html text as content.

The `LithenRawHTMLText` is a class that just extends `String`. Internally it is used to check if the
text inserted came from the `raw` tag function.

## Warning
Using the `raw` function you cannot add events to elements, cannot use `html` function within it and
every value inserted in the tagge template will be converted to string.

## Usage

```ts
raw`
  <div>...</div>
`
// or
raw('<div>...</div>')
```
