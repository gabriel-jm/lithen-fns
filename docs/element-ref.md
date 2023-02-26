# Lithen Tag Functions - ref / ElementRef

The `ref` function is used to create an object that holds a reference to an element. This function
is just a simpler way to intantiate an `ElementRef` object. We warn you that it only works with
elements when receiving the element ref on the `ref` attribute and must be within the `html`
template string.

## How it works?

Internally we check if the provided value in the template is an instance of `ElementRef`, than
we check if it was passed in the `ref` attribute of an element, than we mark the element to later
get an reference to it and set in the `el` property of the `ElementRef`. Because of that fact the
`el` can possibly be undefined.

## Usage

Both the function and class can receive a generic to type which element it is referencing and
receive no parameters.

```ts
const dialogRef = ref<HTMLDialogElement>()
// or
const dialogRef = new ElementRef<HTMLDialogElement>()

html`
  <dialog ref=${dialogRef}>
    <h1>Dialog</h1>
    <button on-click=${() => dialogRef.el?.close()}>
      Close
    </button>
  </dialog>
`
```
