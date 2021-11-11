# Lithen Tag Functions - html

`html` is a tagged template function that makes some parsing in a html string.
This parsings, tries to prevent XSS attacks, minifies the content, add events to an element, parses different types of data, and gives the possibility to call Web Components tags as self closed, instead to write `<app-element></app-element>` you can write `<app-element />`.

## Returns
`html` - type string - the parsed html text.

## Usage
```ts
html`
  <div>...</div>
`
// or
html(['<div>...</div>'], 'values')
```

## Features

### Add events

Events are added to the elements following this pattern: `on-[event name]=[function]`.
The need to add a slash after the **on** is just to prevent conflits with the default
pattern of `on[event name]` if in some case someone wants to use this defaults properties.

```ts
html`
  <button on-click=${() => console.log('click event')}>
    click me
  </button>
`
```

### XSS prevention

Trying to avoid some XSS attacks, the html tag function parses every value passed in the 
template string. If it finds the `<` or `>` characters it will replace then for `&lt;` and
`&gt;` respectively, and if finds `javascript:` will replace it for an empty string. That
last is to ensure that anyone will not try to place it as an URL and be executed as javascript.

```ts
const value = '<p>any value</p>'
const link = 'javascript:alert("trap")'

html`
  <div>${value}</div> <!-- the value will be replaced for &lt;p&gt;any value&lt;/p&gt; -->
  <a href="${link}">link</a> <!-- the link will be replaced for 'alert("trap")' -->
`
```

> **Want to help?** If you find a way to pass through the XSS prevention, please create an issue on github about it.
