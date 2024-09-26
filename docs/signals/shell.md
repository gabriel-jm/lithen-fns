# Lithen Functions - shell / ShellComment

The `shell` function is used to add specific elements based on the signal provided. Common uses
is to render something conditionally or to render multiple elements from a list.

It returns an instance of `ShellComment`, which is a custom comment element, its content is
`</>`, the elements returned by the render callback are dynamicly changed bellow the `ShellComment`.

Shell also has an [once](./shell-once.md) version.

## How it works?

Why this `</>` comment is necessary? This is the solution found to be enable to manipulate, add
or remove elements from a specific place it the DOM freely and based on a signal change.

In previous versions, a custom element called `LithenShell` was used, but I studied some other 
solutions to not need to add a fully new tag on the page, specially since this behavior
is not intuitive.

## Usage
The `shell` function receives a callback as parameter, that should return some value to be shown.
If it does not return any data, nothing will be shown. Every time the `get` method of a data
signal is called within the shell callback this callback will be registred has a subscriber of
this signal. Because of it, the shell callback will be called again when any of the signals used
gets a value update.

For better element diff, use the `key` attribute in the elements returned by the shell. With this
attribute the `ShellComment` knows which elements may represent the same value or a previous 
version of it.

```ts
const letters = signal(['a', 'b', 'c'])

html`
  <ul>
    ${shell(() => {
      return letters.get().map(letter => el`<li>${letter}</li>`)
    })}
  </ul>
`

// or

html`
  <ul>
    <shell>
    ${
      () => letters.get().map(letter => el`<li>${letter}</li>`)
    }
    </shell>
  </ul>
`
```

> Unlike previous versions, your do not have all features by instantiate the 
  `ShellComment` class directly. You need to use the `shell` function or the
  `shell tag` syntax.
