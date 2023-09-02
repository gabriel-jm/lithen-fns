import { html, signal } from './build/index.js'
import { multiRuns } from './multi-runs.js'
import { observableValues } from './observable-values.js'
import { setProperties } from './properties.js'
import { randomTest } from './random-test.js'
import { refs } from './refs.js'
import { scopedCSS } from './scoped-css.js'
import { lithenShell } from './shell.js'
import { signalTest } from './signal.js'
import { stringsInArrays } from './str-arrays.js'

multiRuns()

// randomTest()

// stringsInArrays()

// refs()

// observableValues()

// setProperties()

// signalTest()

// scopedCSS()

// Signal Warn

function signalWarn() {
  document.body.append(html`
    <p ${signal(10)}>Warn</p>
  `)
}

// signalWarn()

// lithenShell()

// console.timeEnd('all')
