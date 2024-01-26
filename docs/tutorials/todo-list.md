# To Do List

This is a simple tutorial from scratch using the `lithen-fns` to create a to do list. I'll be using 
`TypeScript` in this tutorial.

## Setup

For the setup of the project you can follow the [getting-started](../getting-started.md). As I'm
going to use `TypeScript` I'll also use the Vite setup.

## Folders and files

You don't need to follow some specific folder structure or file naming to use `lithen-fns`.
So I'll delete all files from `src` folder, except for the `vite-env.d.ts` which vite uses.
Then create a `main.ts` empty file.

```
> src
-- > main.ts
-- > vite-env.d.ts
```

## Define the elements

I'll make two changes on the `index.html` file.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
    <title>To Do List</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Add a link tag for [PicoCSS](https://picocss.com/) a minimal CSS framework, to quick use. And change 
the document title to "To Do List".

On the `main.ts`, lets put the basic for use the library.

```ts
// src/main.ts

import { html } from 'lithen-fns'

const docFrag = html`
  <h1>Hello World</h1>
`

console.log(docFrag)
```

The first function you need to know is the [html](../html.md) which is a tag function used to create
elements. If you look at the log you'll see that the value is a [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment).
All features of `lithen-fns` works around this `html` function, basically if at some point you 
don't want to use the lithen-fns functions you can.

### Syntax highlight

You'll probably notice that your html markup inside the `html` function don't have syntax highlight.
In VSCode you can easily solve this problem with some extensions.

- `Inline HTML` for syntax highlight and with Emmet and IntelliSense.
- `Auto Close Tag` to help with auto closing tags.
- `es6-string-html` for syntax highlight.
- `lit-plugin` which is used when working with Lit, but it has much more features that maybe you'll 
never use.

Personally I most use `Inline HTMl` and `Auto Close Tag`.

---

```ts
import { html } from 'lithen-fns'

function main() {
  return html`
    <h1>To Do List</h1>

    <form>
      <input type="text" />
      <button>Add</button>
    </form>

    <ul></ul>
  `
}

document.querySelector('#app')!.append(main())
```

With this we defined the basic html structure. Now we need to get the value from the input to add a 
new item to the list. I'll show you 2 ways to do so.

### Add events to elements

First is to add a submit event to the form. You can read about appending events [here](../html.md#add-events).

```ts
import { html } from 'lithen-fns'

function main() {
  function handleSubmit(e: Event) {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const nameInput = form.elements.namedItem('name') as HTMLInputElement

    console.log(nameInput, nameInput.value)
  }

  return html`
    <h1>To Do List</h1>

    <form on-submit=${handleSubmit}>
      <input name="name" type="text" />
      <button>Add</button>
    </form>

    <ul></ul>
  `
}

document.querySelector('#app')!.append(main())
```

Second is to use another `lithen-fns` feature called [ref](../element-ref.md). Which is used to hold
a reference to a specific element.

```ts
import { html, ref } from 'lithen-fns'

function main() {
  const nameInputRef = ref<HTMLInputElement>()

  function handleSubmit(e: Event) {
    e.preventDefault()

    const value = nameInputRef.el?.value

    console.log(nameInputRef, nameInputRef.el, value)
  }

  return html`
    <h1>To Do List</h1>

    <form on-submit=${handleSubmit}>
      <input ref=${nameInputRef} name="name" type="text" />
      <button>Add</button>
    </form>

    <ul></ul>
  `
}

document.querySelector('#app')!.append(main())
```

In this case use `ref` is simpler, but when you have multiple form controls, is better to use only
the event approach. I'll continue the tutorial with the event approach.

## Dynamic list update

We're going to use a [signal](../signals/signals.md) to hold an array of to do items.


