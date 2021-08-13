# Rendering Tag Functions - css

`css` is a tagged template function that minifies a provided css string.

## Returns
`css` - type string - the parsed css text.

## Usage
```ts
css`
  .any_class { ... }
`
// or
css(['.any_class { ... }'])
```
