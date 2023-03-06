# Lithen Tag Functions - html

`html` is a tagged template function that makes some parsing in a html string.
This parsings, tries to prevent XSS attacks, minifies the content, add events to an element, parses different types of data, and gives the possibility to call Web Components tags as self closed.

It returns an instance of [DocumentFragment](https://developer.mozilla.org/pt-BR/docs/Web/API/DocumentFragment).

## Usage
```ts
html`
  <div>...</div>
`
// or
html(['<div>...</div>'], 'values')
```

## Features

### Web Components and Slots as self closed tags

If know how to use a Web Component you probably know that a custom element need to have a close
tag even if it does not have child elements and the same goes to slot elements, based on it, you
can write an custom element tag as a selt closed tag if you want and the html tag function will 
replace it for the closing tag.

```ts
html`
  <!-- instead of write this -->
  <app-element></app-element>
  <slot name="child"></slot>

  <!-- you can write this -->
  <app-element /> <!-- will be parsed for this '<app-element></app-element>' -->
  <slot name="child" /> <!-- will be parsed for this '<slot name="child"></slot>' -->
`
```

---

### Add events

Events are added to the elements following this pattern: `on-[event name]=[value]`.
The value passed must be a Function that implements the 
[EventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventListener) interface.
The need to add a slash after the **on** is just to prevent conflits with the default html
pattern of `on[event name]`, just if someone wants to use this defaults properties.

```ts
html`
  <button on-click=${(_event) => console.log('click event')}>
    click me
  </button>
`
```

---

### Element's dot attributes

This feature is highly inspired by the `lit-html` of the [`Lit`](https://lit.dev/) library. Which
has the possibility the set the value of an element's property directly using a dot before the
property's name.

```ts
html`
  <button .disabled=${true}>
    Disabled
  </button>
`
```

This example is the same as set the button's disabled property directly.

```ts
button.disabled = true
```

---

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

To avoid this and use html text in the html tag function you can use the 
[raw tag function](./raw.md).

> **Want to help?** If you find a way to pass through the XSS prevention, please create an issue on github about it.

---

### Elements merge

As mentioned before the html tag function returns an DocumentFragment, based on it, it can receive
an DocumentFragment as value too, it will take all its childs, hold them in memory for a while and
then place them on current created DocumentFragment.

```ts
html`
  <div>
    ${html`<p>child element</p>`} <!-- this p element will be placed as child of the div element -->
  </div>
`
```

Works with single elements or nodes:

```ts
html`
  <div>
    ${document.createElement('p')}
    <span>${document.createTextNode('text')}</span>
  </div>
`
```

And it works as well with:

**Arrays**

```ts
html`
  <ul>
    ${[
      html`<li>${Math.random()}</li>`,
      raw`<li>${Math.random()}</li>`,
      '<p>Injected</p>' // Will be appended as Text not an Paragraph Element
    ]}
  </ul>
`
```

**Functions**

```ts
// src/paragraph.ts
import { html } from 'lithen-tag-functions'

export function myParagraph(text: string) {
  return html`<p>${text}</p>`
}

// src/main.ts
import { html } from 'lithen-tag-functions'
import { myParagraph } from './paragraph'

html`
  <section>
    ${myParagraph('any text')}
    <!-- as this function is already called the value passed is a DocumentFragment, similiar to the previous example -->
  </section>
`
```
