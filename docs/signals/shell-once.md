# Lithen Functions - shell once

The `shell once` function works just like [shell](./shell.md) with the difference that it will have a first
render and only one update. After that, the `Shell Comment` will be removed and leave the last updated elements.

## Usage

You can use once passing `options` to the `shell` function or using the `shell.once` function.

```ts
const letters = signal(['a', 'b', 'c'])

html`
  <ul>
    ${shell(() => {
      return letters.get().map(letter => el`<li>${letter}</li>`)
    }), { once: true }}
  </ul>
`

// or

html`
  <ul>
    ${shell.once(() => {
      return letters.get().map(letter => el`<li>${letter}</li>`)
    })}
  </ul>
`
```
