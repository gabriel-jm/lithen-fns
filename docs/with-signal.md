# Lithen Tag Functions - withSignal

The `withSignal` function is used to add specific elements based on the signal provided. Common uses
is to render something conditionally or to render multiple elements from a list.

It returns an instance of `LithenShell`, which is a custom element, its tag is `ltn-shell`, the elements returned by the render callback are dynamicly changed in the `LithenShell`'s content.

## How it works?

Why this `ltn-shell` element is necessary? This is the solution found to be enable to manipulate, add
or remove elements from a specific place it the DOM freely and based on a signal change.

## Usage

The `withSignal` function receives two parameters, the first is a `DataSignal` and the second is a 
render callback. Every time the value of the data signal provided changes, the render callback is
called again and we replace all child nodes of the `LithenShell` of the `withSignal`, if the value is
falsy all child nodes of the `LithenShell` are removed.

The callback value receives the same parameters as the [onChange](./signals.md#onchange) callback 
from the `DataSignal`.

```ts
const letters = signal(['a', 'b', 'c'])

html`
  <ul>
    ${withSignal(letters, value => {
      return value.map(letter => el`<li>${letter}</li>`)
    })}
  </ul>
`
```
