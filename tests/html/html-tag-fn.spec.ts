import { css, el, html, raw, ref, signal, shell } from '@/index.js'
import crypto from 'node:crypto'

function select(docFrag: DocumentFragment, query: string) {
  return docFrag.querySelector(query)
}

describe('html tag function', () => {

  describe('Return value', () => {
    it('should return a DocumentFragment with correct elements', () => {
      const docFrag = html`
        <p>Text</p>
        <div>
          <a href="#">link</a>
        </div>
      `
  
      expect(select(docFrag, 'p')?.textContent).toBe('Text')
      expect(select(docFrag, 'div')?.children[0]).toEqual(select(docFrag, 'a'))
      expect(select(docFrag, 'a')?.getAttribute('href')).toBe('#')
      expect(select(docFrag, 'a')?.textContent).toBe('link')
    })
  })

  describe('Value inputs behavior', () => {
    it('should add all elements from an array', () => {
      const docFrag = html`
        <div>${[
          html`<p id="el-1">any text</p>`,
          html`<p id="el-2">any value</p>`
        ]}</div>
      `
  
      expect(select(docFrag, '#el-1')?.textContent).toBe('any text')
      expect(select(docFrag, '#el-2')?.textContent).toBe('any value')
    })
  
    it('should add the correct event to the elements', () => {
      const fakeFn = vi.fn()
      const docFrag = html`
        <div>
          <button on-click=${fakeFn}>
            Click me
          </button>
        </div>
  
        <input on-input=${() => fakeFn()} />
      `
  
      select(docFrag, 'button')?.dispatchEvent(new Event('click'))
      select(docFrag, 'input')?.dispatchEvent(new Event('input'))
  
      expect(fakeFn).toHaveBeenCalledTimes(2)
    })
  
    it('should clean any lost custom event attributes', () => {
      const docFrag = html`
        <div id="event-test" on-click="">
          <p on-cust-event=>any value</p>
          <a on-drag=${undefined as any} href="#">link</a>
          <span on-drop=${''}>any text</span>
          <b on-change=${null as any}>bold</b>
        </div>
      `
  
      expect(select(docFrag, 'div')?.hasAttribute('on-click')).toBe(false)
      expect(select(docFrag, 'a')?.hasAttribute('on-drag')).toBe(false)
      expect(select(docFrag, 'p')?.hasAttribute('on-cust-event')).toBe(false)
      expect(select(docFrag, 'span')?.hasAttribute('on-drop')).toBe(false)
      expect(select(docFrag, 'b')?.hasAttribute('on-change')).toBe(false)
    })
  
    it('should add elements from another DocumentFragment', () => {
      const docFrag = html`
        <header>
          ${html`<h1>Title</h1>`}
        </header>
        <footer>
          ${html`<p>Footer</p>`}
          <br />
          ${html`<span>testes</span>`}
        </footer>
      `
  
      expect(select(docFrag, 'header > h1')).not.toBeNull()
      expect(select(docFrag, 'footer > p')).not.toBeNull()
      expect(select(docFrag, 'span')?.previousElementSibling)
        .toEqual(select(docFrag, 'br'))
    })
  
    it('should add multiple elements from another DocumentFragment', () => {
      const docFrag = html`
        <header>
          ${html`
            <h1>Title</h1>
            <h2>Sub Title</h2>
            <p>Text</p>
          `}
        </header>
      `
  
      expect(select(docFrag, 'header > h1')).not.toBeNull()
      expect(select(docFrag, 'header > h2')).not.toBeNull()
      expect(select(docFrag, 'header > p')).not.toBeNull()
    })

    it('should parse html like text to html entities to html like strings', () => {
      const docFrag = html`<div>${'<p>should parse</p>'}</div>`
      
      expect(select(docFrag, 'p')).toBeNull()
    })
  
    it('should pass the html content if it is passed with raw tag function', () => {
      const input = '<p>should not parse</p>'
      const docFrag = html`<div>${raw(input)}</div>`
      
      expect(select(docFrag, 'p')?.textContent).toBe('should not parse')
    })
  
    it('should render values from a short boolean statement', () => {
      const value = true
      const docFrag = html`<div>${value && 'hello'}</div>`
  
      expect(select(docFrag, 'div')?.textContent).toBe('hello')
    })
  
    it('should not render the content if a short boolean statement not succeeds', () => {
      const value = false
      const docFrag = html`<section>${value && 'hello'}</section>`
  
      expect(select(docFrag, 'section')?.textContent).toBe('')
    })

    it('should parse correctly self closed custom elements tags', () => {
      const docFrag = html`
        <app-element />
  
        <app-section
          id="any_id"
          attr
        />
  
        <header>
          <app-icon />
          <h1>Titulo</h1>
        </header>
      `
  
      const appSection = select(docFrag, 'app-section')
      const appIcon = select(docFrag, 'app-icon')
  
      expect(appSection?.nextElementSibling).toEqual(select(docFrag, 'header'))
      expect(appIcon?.nextElementSibling).toEqual(select(docFrag, 'h1'))
    })
  
    it('should accept single elements as value', () => {
      class CustomElement extends HTMLElement {}
  
      customElements.define('custom-element', CustomElement)
      
      const paraph = document.createElement('p')
      
      const docFrag = html`
        <section>${paraph}</section>
        ${new CustomElement()}
        <p class="paragh">${document.createTextNode('text')}</p>
      `
  
      expect(select(docFrag, 'section > p')).toBeDefined()
      expect(select(docFrag, 'custom-element')).toBeDefined()
      expect(select(docFrag, '.paragh')?.textContent).toBe('text')
    })
  
    it('should accept raw tag fn values in an array', () => {
      const docFrag = html`
        <section>
          ${[
            raw`<p>Paraph</p>`,
            raw`<span>Text</span>`,
            '<i>Injected</i>',
            new String('<h1>Invalid title</h1>')
          ]}
        </section>
      `
  
      const paraph = select(docFrag, 'section > p')
      const span = select(docFrag, 'section > span')
  
      expect(paraph).toBeDefined()
      expect(paraph?.textContent).toBe('Paraph')
      expect(span).toBeDefined()
      expect(span?.textContent).toBe('Text')
      expect(select(docFrag, 'section > i')).toBeNull()
      expect(select(docFrag, 'section > h1')).toBeNull()
    })

    it('should enable element references using the ref function', () => {
      const paragraphRef = ref()
      const docFrag = html`
        <section>
          <h1>Title</h1>
          <p ref=${paragraphRef}>Paragraph</p>
        </section>
      `
      const paragraphElement = docFrag.querySelector('p')
  
      expect(paragraphRef.el).toEqual(paragraphElement)
    })
  
    it('should not remove wrong missing event binding text', () => {
      const docFrag = html`<ignem-confirmation-dialog   class="hi"   />`
  
      const dialog = docFrag.querySelector('ignem-confirmation-dialog')
  
      expect(dialog).not.toBeNull()
    })

    it('should set the value to the element property if using dot attributes', () => {
      const value = { value: 100 }
      const docFrag = html`<div .attr=${value}></div>`
      const div = docFrag.querySelector('div') as HTMLDivElement & { attr: { value: 100 } }
  
      expect(div.attr).toEqual(value)
    })

    it('should attach styles to the element with css attribute and LithenCSSText as value', () => {
      const styles = css`
        & {
          color: red;
          background-color: blue;
        }
      `
      const docFrag = html`<div css=${styles}></div>`
      const div = docFrag.querySelector('div')
  
      expect(div?.getAttribute('css')).toBeNull()
    })
  })

  describe('el function', () => {
    it('should return the first element when using html.first', () => {
      const span = el/*html*/`
        <span></span>
        <div></div>
        <ul></ul>
      `
  
      expect(span).toBeInstanceOf(HTMLSpanElement)
    })  
  })

  describe('Signals', () => {
    it('should add correct signal data and listeners on signal set in an attribute', () => {
      const color = signal('red')
      const docFrag = html`<div class=${color}></div>`
      const div = docFrag.querySelector('div')
  
      document.body.append(docFrag)
      
      expect(div?.getAttribute('class')).toBe('red')
  
      color.set('blue')
  
      expect(div?.getAttribute('class')).toBe('blue')
    })
  
    it('should add or remove an attribute if its bind to a boolean signal', () => {
      const disabled = signal(true)
      const docFrag = html`<button disabled=${disabled}>Click</button>`
      const btn = docFrag.querySelector('button')
  
      document.body.append(docFrag)
  
      expect(btn?.getAttribute('disabled')).toBe('')
  
      disabled.set(false)
  
      expect(btn?.getAttribute('disabled')).toBeNull()
    })
  
    it('should add a text node when a signal is inserted outside an element', () => {
      const sig = signal(10)
      const docFrag = html`<p>Count: ${sig}</p>`
      const p = docFrag.querySelector('p')
  
      document.body.append(docFrag)
  
      expect(p?.textContent).toBe('Count: 10')
  
      sig.set(value => value + 2)
  
      expect(p?.textContent).toBe('Count: 12')
    })

    it('should update the element property if the set value is a signal', () => {
      const keyId = signal(crypto.randomUUID())
      const docFrag = html`<div .keyId=${keyId}></div>`
      const div = docFrag.querySelector('div') as HTMLDivElement & { keyId: string }
  
      document.body.append(docFrag)
  
      expect(div.keyId).toBe(keyId.get())
  
      keyId.set(crypto.randomUUID())
  
      expect(div.keyId).toBe(keyId.get())
    })

    it('should update specific parts based on a DataSignal when using shell', () => {
      const show = signal(true)
      const docFrag = html`
        <button on-click=${() => show.set(!show.get())}>
          Show / Hide
        </button>
        ${shell(show, value => {
          return value && el/*html*/`
            <span>Showing</span>
          `
        })}
      `
      docFrag.querySelector('button')?.dispatchEvent(new Event('click'))
  
      expect(docFrag.querySelector('span')).toBeNull()
    })
  })

  describe('Signal direct update', () => {
    it('should update an array signal listener when an update method is called', () => {
      const people = signal([
        { name: 'Gabriel', age: 23 }
      ])

      document.body.append(html`
        <ul id="list">
          ${shell(people, value => value.map(person => html`
            <li>${person.name} | ${person.age}</li>
          `))}
        </ul>
      `)

      const list = document.getElementById('list')

      expect(list?.innerHTML).toBe('<!--</>--><li>Gabriel | 23</li>')

      people.get()[0].age = 24
      people.update()

      expect(list?.innerHTML).toBe('<!--</>--><li>Gabriel | 24</li>')
    })
  })
})
