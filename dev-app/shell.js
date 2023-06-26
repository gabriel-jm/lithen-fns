export function lithenShell() {
  function alphabet() {
    const aCharCode = 'a'.charCodeAt(0)
    const letters = signal(['a', 'b', 'c'])
    
    document.body.append(html`
      <h4>Alphabet</h4>
      <ul>
        ${shell(letters, letters => {
          return letters.map(letter => el/*html*/`<li>${letter}</li>`)
        })}
      </ul>
      <button on-click=${() => {
        letters.set(value => [
          ...value,
          String.fromCharCode(aCharCode + value.length)
        ])
      }}>
        Add Letter
      </button>
      <br />
    `)
  }
  
  alphabet()
  
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
  
    return html`
      <ul ref=${ulRef}>
        ${shell(users, (value) => {
          return value.filtered.map(user => html`
            <li>
              <strong>${user.username}</strong>
              <span>&nbsp;(${user.name})</span>
              <span> - ${user.email}</span>
            </li>
          `)
        })}
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
}
