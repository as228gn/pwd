/**
 * The chat-application web component module.
 *
 * @author Anna Ståhlberg <as228gn@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style> 
#chatBox {
  width: 500px;
  height: 200px;
  border: solid black;
  overflow: scroll;
  margin-bottom: 20px;
}

.container {
  margin-left: 35px;
}

#sendButton{
  margin-top: 10px;
  margin-bottom: 20px;
}

#message {
  width: 500px;
  height: 50px;
}

.choseTypeDiv {
  margin-top: 10px;
}
#cursive {
  font-family: cursive;
}
#lucida {
  font-family: Lucida Console;
}
#helvetica {
  font-family: Helvetica;
}

.hidden {
  display: none;
 }
</style>
<div class="container">
  <div id="user"></div>
  <div id="chatBox"></div>
  <input id="message" type="text" placeholder="Skriv ditt meddelande">
  <input id="sendButton" type="button" value="Skicka">
</div>
<input id="userName" class="hidden" type="text" placeholder="Välj användarnamn">
<div class="choseTypeDiv" >Välj ditt typsnitt</div>
<div>
  <button id="cursive">Text</button>
  <button id="lucida">Text</button>
  <button id="helvetica">Text</button>
</div>
`

customElements.define('chat-application',
  /**
   * Represents a flipping-card element.
   */
  class extends HTMLElement {
    #message
    #sendButton
    #socket
    #chatBox
    #userName
    #cursive
    #lucida
    #helvetica
    /**
     * Creates an instance of the current type.
     */
    constructor() {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#message = this.shadowRoot.querySelector('#message')
      this.#sendButton = this.shadowRoot.querySelector('#sendButton')
      this.#chatBox = this.shadowRoot.querySelector('#chatBox')
      this.#userName = this.shadowRoot.querySelector('#userName')
      this.#cursive = this.shadowRoot.querySelector('#cursive')
      this.#lucida = this.shadowRoot.querySelector('#lucida')
      this.#helvetica = this.shadowRoot.querySelector('#helvetica')
    }

    connectedCallback() {
      this.#socket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket', 'charcords')
      this.#userName.addEventListener('keydown', (event) => { if (event.key === 'Enter') { this.collectUserName() } })
      this.#sendButton.addEventListener('click', (event) => { this.sendMessage() })
      this.#message.addEventListener('keydown', (event) => { if (event.key === 'Enter') { this.sendMessage() } })
      this.#socket.addEventListener('message', (event) => { this.recievedMessage(event) })
      this.checkUserName()
      this.#cursive.addEventListener('click', (event) => { this.changeText() })
      this.#lucida.addEventListener('click', (event) => { this.changeTexts() })
      this.#helvetica.addEventListener('click', (event) => { this.changeTextss() })
    }

    changeText () {
      this.#message.style.fontFamily = 'cursive'
      this.#chatBox.style.fontFamily = 'cursive'
    }

    changeTexts () {
      this.#message.style.fontFamily = 'Lucida Console'
      this.#chatBox.style.fontFamily = 'Lucida Console'
    }

    changeTextss () {
      this.#message.style.fontFamily = 'Helvetica'
      this.#chatBox.style.fontFamily = 'Helvetica'
    }

    checkUserName () {
      const userNames = JSON.parse(window.localStorage.getItem('Username'))
      if (userNames === '' || userNames === null) {
        this.#userName.classList.remove('hidden')
      } else {
        const user = this.shadowRoot.querySelector('#user')
        user.textContent = 'Välkommen ' + userNames
        this.#userName.classList.add('hidden')
      }
    }

    collectUserName () {
      const userName = this.#userName.value
      window.localStorage.setItem('Username', JSON.stringify(userName))
      const user = this.shadowRoot.querySelector('#user')
      user.textContent = 'Välkommen ' + userName
      this.#userName.classList.add('hidden')
    }

    recievedMessage (event) {
      const answerFromSocket = JSON.parse(event.data)
      const message = document.createElement('div')
      message.textContent = answerFromSocket.data
      this.#chatBox.appendChild(message)
    }

    sendMessage() {
      const datas = this.#message.value
      const apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      const userName = this.#userName.value
      const socketMessage = {
        type: 'message',
        data: datas,
        username: userName, // Replace with actual username logic if needed
        channel: 'my, not so secret, channel', // Replace with actual channel logic if needed
        key: apiKey // Replace with actual key logic if needed
      }
      this.#socket.send(JSON.stringify(socketMessage))
      this.#message.value = ''
    }
  }
)
