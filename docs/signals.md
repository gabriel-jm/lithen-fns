# Lithen Tag Functions - signal / DataSignal

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
`onChange` method, passing the new value as first parameter and the old value as second.

- ### onChange

  The `onChange` method receives a function as a listener that is registred to be called later when
the `set` method is called changing the value that is currently hold by the signal. The listener
function receives the new value as first parameter and the old value as second, and don't expect
a returned value.

### Signals in the text content
