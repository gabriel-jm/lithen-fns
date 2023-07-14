# Lithen Functions - signal / DataSignal

The `signal` function is used in certain places within the `html` template string to have some
kind of reactivite with a specify value which is passed as parameter. This function is just a
simpler way to instantiate a `DataSignal` object. We warn you that the reactive effect of the
signal just works in some places.

## How it works?

Internally we check if the provided value is an instance of `DataSignal`, than we check where
the signal was placed, if is attached to an attribute, if is attached to a property, if not for
both cases we consider that it is placed outside or within an element as content.

For each case is added a function to the `onChange` method of the `DataSignal` that are called
when the value the the signal holds changes.

## Usage

### Methods

- ### get

  The `get` method returns the current value that `DataSignal` holds at that moment.

- ### set

  The `set` method is used to change the current value hold by the signal. It receives the new value
as parameter or can receive a function that receives the current value as parameter and uses the
returned value as new one for the signal. The function calls all listeners registred with the 
`onChange` method, passing the new value as first parameter and the old value as second. If the 
provided value is equal to the old value the value hold by the DataSignal is not updated and the 
listeners are not notified.

- ### onChange

  The `onChange` method receives a function as a listener that is registred to be called later when
the `set` method is called changing the value that is currently hold by the signal. The listener
function receives the new value as first parameter and the old value as second, and don't expect
a returned value.

- ### remove

  The `remove` method is used to remove a listener from the `DataSignal` list, it receives the 
  listener function that was passed to the `onChange` method.

- ### clear

  The `clear` method is similar to the `remove` method but instead of removing one listener, it removes all listeners attached to the signal.

---

### Data Signals in the text content

When a signal is set within or outside a tag this content will be converted to a string and will be
placed a text node where the signal was placed.

```ts
const count = signal(0)

html`a
  <div>
    <p>Count: ${count}</p>
    <button on-click=${() => count.set(value => value + 1)}>
      Increment
    </button>
  </div>
`
```

In this example the place where the count constant, which is a `DataSignal`, is placed will have a 
text node with the current count value. Also we add a listener with the `onChange` method of the 
signal to update the text node content whenever the count signal is updated.

### Data Signals in elements attributes

When a signal is set as a value of an element's attribute, we set the signal value as a string in
the elements attribute.

```ts
const bgColor = signal('red')

html`
  <div class=${bgColor}>
    <p>Background ${bgColor}</p>
    <button on-click=${() => bgColor.set('red')}>
      Red
    </button>
    <button on-click=${() => bgColor.set('blue')}>
      Blue
    </button>
  </div>
`
```

In this example we add to the div's `class` attribute the value of `red` and add a listener with the 
`onChange` method of the signal to update the attribute's value whenever the signals value changes.
When the signal is set in an attribute with a boolean value it has a different effect, it checks if
the value is `true` and sets the attribute in the element with an empty value and if the value is
`false` it removes the attribute from the element.

### Data Signals in elements properties

When a signal is set as a value of an element's property, it works just like when set to the 
element's attribute, but with the difference that when it is with properties the raw value of the
signal is set the element's property. Just like with attributes is set a listener with the `onChange`
method of signal to update the element's property value whenever the signal's value changes.

See more about how to set element's properties in [Element's dot attributes](./html.md#elements-dot-attributes).

---

## Details to be aware of

### Elements as value of a data signal

You can set an element as the value of a signal, most of its use cases can be achived using a 
[shell](./shell.md) and with a better approach, but if you want to use, we don't 
recommend to do it with Document Fragments, because internally we use method `replaceWith` of the 
elements to replace the old element for the new one, and Document Fragments don't have this method. 
But even if it has, will not work as expected because when the fragment enters the DOM or in another 
fragment, it leaves all its child nodes and remain only an empty fragment, so even if the fragment 
has the `replaceWith` method it will not work as well.

So do something like this
```ts
signal(el`<span>Hi</span>`)
```
Instead of
```ts
signal(html`<span>Hello</span>`)
```

### Place the data signal with no attributes in the element

Basically is doing something like this

```ts
const data = signal('any_data')

html`
  <p ${data}></p>
`
```

This is a problem basically because internally we don't detect attribute bind to the signal, so we
consider that it is a text content and try to place a template tag as placeholder and the element
ends up like this

```html
<p <template="" el="el-0">></p>
```

The `el-0` can be any value, this is the index of the order which the data was inserted in the tagged
template. In the end the paragraph ends having a `>` in its text content. We have a detection to
get all elements with that `<template` attribute and send a warn. We are making sure to have a better
solution to this problem but for now be aware that this can happen.
