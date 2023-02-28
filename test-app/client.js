import { html, css, raw, ref, signal, createStyled, el } from './build/index.js'

console.time('all')
function times() {
  const quantity = 8_000

  console.time('Simple divs')
  for (let i=0; i<quantity; i++) {
    html`
      <div on-click=${() => console.log('hi')}>Hi</div>
    `
  }
  console.timeEnd('Simple divs')

  console.time('Ul with injected li array')
  for (let i=0; i<quantity; i++) {
    html`
      <ul>
        ${[
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
        ]}
      </ul>
    `
  }
  console.timeEnd('Ul with injected li array')

  console.time('Ul with injected li separated')
  for (let i=0; i<quantity; i++) {
    html`
      <ul>
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
      </ul>
    `
  }
  console.timeEnd('Ul with injected li separated')

  function section() {
    return html`
      <header on-click=${() => console.log('header')}>
        Header
      </header>
    `
  }

  console.time('Various events divs')
  for (let i=0; i<quantity; i++) {
    html`
      <div on-click=${() => console.log('hi')}>
        Hi
      </div>
      ${section()}
    `
  }
  console.timeEnd('Various events divs')
}

// times()

// random test

function randomTest() {
  class MySection extends HTMLElement {
    constructor() {
      super()
      this.append(this.render())
    }
  
    update(count) {
      this.querySelector('p').textContent = `Count: ${count}`
    }
  
    render() {
      const state = {
        count: 0,
        listeners: [],
        subscribe(obj) {
          this.listeners.push(obj)
        },
        notify(value) {
          for (const listener of this.listeners) {
            listener.update(value)
          }
        },
        increment() {
          this.count++
          this.notify(this.count)
        }
      }
  
      state.subscribe(this)
  
      return html`
        <p>Count: ${state.count}</p>
        <button on-click=${() => state.increment()}>
          Increment
        </button>
      `
    }
  }
  
  customElements.define('my-section', MySection)
  
  function testeApp() {
    const header = () => html`
      <header on-mousedown=${() => console.log('header mouse down')}>
        Header
      </header>
    `
  
    document.body.append(html`
      ${header()}
      ${new MySection()}
      ${new MySection()}
    `)
  }
  
  console.time('testeApp function')
  testeApp()
  console.timeEnd('testeApp function')
}

// randomTest()

// String in arrays

function stringsInArrays() {
  document.body.append(html`
    <ul>
      ${[
        el/*html*/`<li>Array test</li>`,
        html`<li>DocFrag</li>`,
        raw`<li>Raw</li>`,
        `<li>Raw string</li>`
      ]}
    </ul>
  `)
}

stringsInArrays()

// refs

function refs() {
  const dialogRef = ref()

  const dialog = html`
    <div style="padding: 20px 0">
      <button on-click=${() => dialogRef.el?.show()}>
        Open dialog with ref
      </button>
      <dialog ref=${dialogRef} style="padding: 10px">
        <h1>Element Ref</h1>
        <p>Element ref example with a dialog</p>
        <button on-click=${() => dialogRef.el?.close()}>
          Close
        </button>
      </dialog>
    </div>
  `

  document.body.append(dialog)
}

refs()

// observable values

function observableValues() {
  // Dialog
  const dialogData = {
    open: signal(false),
    bg: signal('blue')
  }

  document.body.append(html`
    <dialog class=${dialogData.bg} open=${dialogData.open}>
      ${raw`<h1>Observer Dialog</h1>`}
      <button on-click=${() => dialogData.bg.set('red')}>
        Red
      </button>
      <button on-click=${() => dialogData.bg.set('blue')}>
        Blue
      </button>
      <button on-click=${() => dialogData.open.set(false)}>
        Close
      </button>
    </dialog>
    <button on-click=${() => dialogData.open.set(true)}>
      Open dialog with signal
    </button>
  `)
  
  // Background color
  const backgroundColor = signal('red')
  
  document.body.append(html`
    <div class=${backgroundColor}>
      Observer Div
      <button on-click=${() => backgroundColor.set('red')}>
        Red
      </button>
      <button on-click=${() => backgroundColor.set('blue')}>
        Blue
      </button>
    </div>
  `)

  // Counter
  const count = signal(0)

  document.body.append(html`
    <h3>Counter V2</h3>
    <p>
      Count: ${count} (Numeric)
    </p>
    <button on-click=${() => count.set(value => value + 1)}>
      Increment
    </button>
  `)
}

observableValues()

// Properties

function setProperties() {
  document.body.append(html`
    <button
      .disabled=${true}
      .keyId=${'12'}
    >
      Property disabled
    </button>
  `)
}

setProperties()

// Signal with Properties

function signalProperties() {
  const divRef = ref()
  const keyId = signal(crypto.randomUUID())
  
  document.body.append(html`
    <div ref=${divRef} .keyId=${keyId}>
      <p>${keyId}</p>
      <button on-click=${() => {
        keyId.set(crypto.randomUUID())
        console.log('Div key id', divRef.el?.keyId)
      }}>
        Change key id
      </button>
    </div>
  `)
}

signalProperties()

// Signal with elements

function signalWithElements() {
  let currentSymbol = 'cent'
  const symbol = signal(el/*html*/`<span>&cent;</span>`)

  document.body.append(html`
    <div>
      <p>Current symbol</p>
      ${symbol}
      <button on-click=${() => {
        if (currentSymbol === 'cent') {
          currentSymbol = 'euro'
        } else {
          currentSymbol = 'cent'
        }

        symbol.set(el`<span>&${currentSymbol};</span>`)
      }}>Toogle</button>
    </div>
  `)

  // document.body.append(html`
  //   <div>${when()}</div>
  // `)
}

signalWithElements()

// Scoped CSS

const backgroundColor = (backgroundColor) => css`
  & {
    background-color: ${backgroundColor};
    padding: 16px;
  }

  & span {
    font-weight: bold;
  }
`

const color = (color) => css`& { color: ${color}; }`

function scopedCSS() {
  document.body.append(html`
    <div css=${backgroundColor('#4d5')}>
      <span>CSS test 1</span>
    </div>
    <div css=${backgroundColor('#54d')}>
      CSS test 2
    </div>
    <div css=${css(['',''], backgroundColor('#222'), color('#eee'))}>
      <span>CSS test 3</span>
    </div>
  `)
}

scopedCSS()

// Styled elements

function styledElements() {
  function styledDiv(children) {
    const div = createStyled('div', backgroundColor('#888'))
    children && div.append(children)
    return div
  }

  document.body.append(styledDiv(html`
    <h2>Styled Div</h2>
    <p>Oh gosh</p>
  `))

  document.body.append(styledDiv(html`
    <article>
      <h2>Styled Article</h2>
      <p>lorem ipsum</p>
    </article>
  `))
}

styledElements()

// Signal Warn

function signalWarn() {
  document.body.append(html`
    <p ${signal(10)}>Warn</p>
  `)
}

// signalWarn()

const users = signal({
  original: [],
  filtered: []
})

async function usersList() {
  const ulRef = ref()
  const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())

  if (!usersResponse.length) {
    return el/*html*/`<span>Error</span>`
  }

  users.set({ original: usersResponse, filtered: usersResponse })
  users.onChange(newValue => {
    ulRef.el?.replaceChildren(...newValue.filtered.map(user => html`
      <li>
        <strong>${user.username}</strong>
        <span>(${user.name})</span>
        <span>- ${user.email}</span>
      </li>
    `))
  })

  return html`
    <ul ref=${ulRef}>
      ${usersResponse.map(user => html`
        <li>
          <strong>${user.username}</strong>
          <span>(${user.name})</span>
          <span>- ${user.email}</span>
        </li>
      `)}
    </ul>
  `
}

function inputDebunce(fn) {
  let timeoutId = null

  return e => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(fn, 500, e)
  }
}

async function filter() {
  const filter = signal('')

  const onInput = inputDebunce(e => {
    filter.set(e.target.value)
    users.set(value => ({
      ...value,
      filtered: value.original.filter(user => {
        return user.username.toLowerCase().match(
          `^${filter.get()}`
        )
      })
    }))
  })
  
  document.body.append(html`
    <input on-input=${onInput} />
    <p>Filter: ${filter}</p>
    ${await usersList()}
  `)
}

filter()

console.timeEnd('all')
