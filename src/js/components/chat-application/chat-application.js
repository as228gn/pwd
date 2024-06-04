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
  height: 100px;
  border: solid black;
  overflow: scroll;
}

#message {
  width: 500px;
  height: 50px;
}

.hidden {
  display: none;
 }
</style>
  <input id="userName" type="text" placeholder="Skriv ditt username">
  <div id="user"></div>
  <input id="sendButton" type="button" value="Skicka">
  <div id="chatBox"></div>
  <input id="message" type="text" placeholder="Skriv ditt meddelande">
  
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
    }

    connectedCallback() {
      this.#socket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket', 'charcords')
      this.#userName.addEventListener('keydown', (event) => { if (event.key === 'Enter') { this.collectUserName() } })
      this.#sendButton.addEventListener('click', (event) => { this.sendMessage() })
      this.#message.addEventListener('keydown', (event) => { if (event.key === 'Enter') { this.sendMessage() } })
      this.#socket.addEventListener('message', (event) => { this.recievedMessage(event) })
    }

    collectUserName () {
      const userName = this.#userName.value
      const user = this.shadowRoot.querySelector('#user')
      user.textContent = 'Användare: ' + userName
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
