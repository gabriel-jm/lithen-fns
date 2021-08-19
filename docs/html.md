# Rendering Tag Functions - html

`html` is a tagged template function that makes some parsing in a html string.
This parsings, tries to prevent XSS attacks, minifies the content, and gives the possibility to call Web Components tags as self closed, instead to write `<app-element></app-element>` you can write `<app-element />`.

## Returns
`html` - type string - the parsed html text.

## Usage
```ts
html`
  <div>...</div>
`
// or
html(['<div>...</div>'])
```

## Want to help?
If you find a way to pass through the XSS prevention, please create an issue on github about it.
