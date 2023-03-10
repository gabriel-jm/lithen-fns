# Lithen Tag Functions - signalRecord / DataSignalRecord

`signalRecord` is a function that receives an object and return an instance of `DataSignalRecord`, 
which is class to produces a copy of the object received with which key being an instance of 
`DataSignal`.

The copy is swallow, so it will not cycle through nested objects to make them `DataSignalRecords` 
too. But if the value of some field of the object already is a `DataSignal` or `DataSignalRecord` it 
just leave the value as it is.

Based on this the `DataSignalRecord` has no special treatment when passed as value in an template, 
so will be considered a common object.

Why not just set an object as value of the `DataSignal`? When you set an object as data of a 
`DataSignal` the object it self is the value and any object returned by the `set` method it 
considered the new value. But that is not the behaviour we want in all times.

In situations like this
```ts
const obj = {
  name: signal('Jonh'),
  checks: signal(0),
  items: signal([
    { value: 10, quantity: 1 }
  ])
}
```

You can do this
```ts
const obj = signalRecord({
  name: 'Jonh',
  checks: 0,
  items: [
    { value: 10, quantity: 1 }
  ]
})
```
