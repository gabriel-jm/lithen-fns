# Lithen Functions

Functions to use with html and css to create simple and powerful UI elements.
Its part of Lithen modules. It works alone but is created to use with Web Components.

## Getting started

You can see the [Getting started](./docs/getting-started.md) page, teaching how to setup a [Vanilla project](./docs/getting-started.md#vanilla-project) or a [project with Vite](./docs/getting-started.md#project-with-vite).

After the `Getting started`, try this counter modal example:

```ts
function counterModal() {
  const count = signal(0)
  const dialogRef = ref<HTMLDialogElement>()

  function increment() {
    count.set(value => value + 1)
  }

  return html`
    <dialog ref=${dialogRef}>
      <p>Count: ${count}</p>
      <button on-click=${increment}>
        Increment
      </button>
      <button on-click=${() => dialogRef.el?.close()}>
        Close
      </button>
    </dialog>
    
    <button on-click=${() => dialogRef.el?.showModal()}>
      Open Modal
    </button>
  `
}

document.body.append(counterModal())
```

---

## List of including functions, tag functions and its features

- [html](./docs/html.md)
  - [Web Components and Slots as self closed tags](./docs/html.md#web-components-and-slots-as-self-closed-tags)
  - [Add Events](./docs/html.md#add-events)
  - [Element's dot attributes](./docs/html.md#elements-dot-attributes)
  - [XSS prevention](./docs/html.md#xss-prevention)
  - [Elements merge](./docs/html.md#elements-merge)
- [el](./docs/el.md)
- [raw](./docs/raw.md)
- [css](./docs/css.md)
- [createStyled](./docs/create-styled.md)
- [refs](./docs/element-ref.md)
- [signals](./docs/signals.md)
  - [DataSignal](./docs/signals/data-signal.md)
  - [DataSignalRecord](./docs/signals/data-signal-record.md)
  - [Shell](./docs/signals/shell.md)

## VSCode Extensions Recommendation
- [lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin) which came with
`lit-html` and `styled components` extensions.
- [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)
for auto closing HTML tags.
- [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html)
for HTML syntax highlight to custom tag functions, good to work with the `el` tag function.
- [inline HTML](https://marketplace.visualstudio.com/items?itemName=pushqrdx.inline-html) for emmet
and IntelliSense in `html` and `css` tag functions.

## Other libs that are part of Lithen
- [lithen-super-element](https://www.npmjs.com/package/lithen-super-element)
- [lithen-router](https://www.npmjs.com/package/lithen-router)
