# Lithen Tag Functions - html

`html` is a tagged template function that makes some parsing in a html string.
This parsings, tries to prevent XSS attacks, minifies the content, add events to an element, parses different types of data, and gives the possibility to call Web Components tags as self closed, instead to write `<app-element></app-element>` you can write `<app-element />`.

## Returns
`DocumentFragment` - type object - an instance of [DocumentFragment](https://developer.mozilla.org/pt-BR/docs/Web/API/DocumentFragment).

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

Events are added to the elements following this pattern: `on-[event name]=[value]`.
The value passed must be a Function or an object that implements the 
[EventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventListener) interface.
The need to add a slash after the **on** is just to prevent conflits with the default html
pattern of `on[event name]`, just if someone wants to use this defaults properties.

```ts
html`
  <button on-click=${() => console.log('click event')}>
    click me
  </button>
`
// or, using EventListenerObjects

const eventHandler = {
  handleEvent = () => console.log('click event')
}

html`
  <button on-click=${eventHandler}>
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

And it works as well with:

**Arrays**

```ts
html`
  <ul>
    ${[
      html`<li>${Math.random()}</li>`,
      html`<li>${Math.random()}</li>`,
      html`<li>${Math.random()}</li>`
    ]}
  </ul>
`
```

**Functions**

```ts
function myParagraph(text: string) {
  return html`<p>${text}</p>`
}

html`
  <section>
    ${myParagraph('any text')}
    <!-- as this function is already called the value passed is a DocumentFragment, similiar to the previous example -->
  </section>
`
```

### Auto call functions

Any function passed as a value that is not interpreted as an EventListener, will be called
and then its return value will be reinterpreted. None value is passed has parameters to
these functions when called.

```ts
function getData() {
  return [1, 2, 3]
}

html`
  <header>
    ${getData} <!-- this function will be automatically called -->
  </header>
`
```
