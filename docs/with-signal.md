# Lithen Tag Functions - withSignal

The `withSignal` function is used to add specific elements based on the signal provided. Common uses
is to render something conditionally or to render multiple elements from a list.

It returns an instance of `WithSignal`. The place where the `withSignal` is placed will have a custom
element from lithen called `LithenShell`, its tag is `ltn-shell`, the elements returned by the 
`withSignal` callback will be the children of this element so be aware that whenever you use this 
signal there will have a `ltn-shell` element.

## How it works?

Why this `ltn-shell` element is necessary? This is the solution found to be enable to manipulate, add
or remove elements from a specific place it the DOM freely.

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
    ${withSignal(letters, value => html`
      <li>${value}</li>
    `)}
  </ul>
`
```
