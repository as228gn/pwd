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
  border: solid cadetblue;
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

#user {
  font-size: larger;
  margin-bottom: 20px;
}

#message {
  width: 500px;
  height: 50px;
  border: solid cadetblue;
}

#userNameDiv {
  margin-bottom: 50px;
}

.choseTypeDiv {
  margin-top: 20px;
  margin-bottom: 5px;
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
  <div id="userNameDiv" class="hidden">
    <input id="userName" type="text" placeholder="Välj användarnamn">
    <button id="userNameButton">Registrera</button>
  </div>
</div>
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
    #userNameDiv
    #userNameButton
    #cursive
    #lucida
    #helvetica
    #abortController
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#abortController = new AbortController()
      this.#message = this.shadowRoot.querySelector('#message')
      this.#sendButton = this.shadowRoot.querySelector('#sendButton')
      this.#chatBox = this.shadowRoot.querySelector('#chatBox')
      this.#userName = this.shadowRoot.querySelector('#userName')
      this.#userNameDiv = this.shadowRoot.querySelector('#userNameDiv')
      this.#userNameButton = this.shadowRoot.querySelector('#userNameButton')
      this.#cursive = this.shadowRoot.querySelector('#cursive')
      this.#lucida = this.shadowRoot.querySelector('#lucida')
      this.#helvetica = this.shadowRoot.querySelector('#helvetica')
    }

    /**
     * Eventlisteners, startconnection to the websocketserver and a checkUserName function to start with.
     */
    connectedCallback () {
      this.#socket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket', 'charcords')
      this.#userName.addEventListener('keydown', (event) => { if (event.key === 'Enter') { this.collectUserName() } }, { signal: this.#abortController.signal })
      this.#userNameButton.addEventListener('click', (event) => { this.collectUserName() }, { signal: this.#abortController.signal })
      this.#sendButton.addEventListener('click', (event) => { this.sendMessage() }, { signal: this.#abortController.signal })
      this.#message.addEventListener('keydown', (event) => { if (event.key === 'Enter') { this.sendMessage() } }, { signal: this.#abortController.signal })
      this.#socket.addEventListener('message', (event) => { this.recievedMessage(event) }, { signal: this.#abortController.signal })
      this.checkUserName()
      this.#cursive.addEventListener('click', (event) => { this.changeCursive() }, { signal: this.#abortController.signal })
      this.#lucida.addEventListener('click', (event) => { this.changeLucida() }, { signal: this.#abortController.signal })
      this.#helvetica.addEventListener('click', (event) => { this.changeHelvetica() }, { signal: this.#abortController.signal })
    }

    /**
     * A function that changes the font to cursive.
     *
     */
    changeCursive () {
      this.#message.style.fontFamily = 'cursive'
      this.#chatBox.style.fontFamily = 'cursive'
    }

    /**
     * A function that change the font to Lucida Console.
     *
     */
    changeLucida () {
      this.#message.style.fontFamily = 'Lucida Console'
      this.#chatBox.style.fontFamily = 'Lucida Console'
    }

    /**
     * A function that change the font to Helvetica.
     *
     */
    changeHelvetica () {
      this.#message.style.fontFamily = 'Helvetica'
      this.#chatBox.style.fontFamily = 'Helvetica'
    }

    /**
     * A function that checks if the user already has a username.
     *
     */
    checkUserName () {
      try {
        const userNames = JSON.parse(window.localStorage.getItem('Username'))
        if (userNames === '' || userNames === null) {
          this.#userNameDiv.classList.remove('hidden')
        } else {
          const user = this.shadowRoot.querySelector('#user')
          user.textContent = 'Välkommen ' + userNames + '!'
          this.#userNameDiv.classList.add('hidden')
        }
      } catch (error) {
        console.error(error.message)
      }
    }

    /**
     * A function that collects the username if there are any.
     *
     */
    collectUserName () {
      try {
        const userName = this.#userName.value
        window.localStorage.setItem('Username', JSON.stringify(userName))
        const user = this.shadowRoot.querySelector('#user')
        user.textContent = 'Välkommen ' + userName + '!'
        this.#userNameDiv.classList.add('hidden')
      } catch (error) {
        console.error(error.message)
      }
    }

    /**
     * A function that puts the recieved message in the chatBox.
     *
     * @param {event} event An event that contains the message to put in the chatbox.
     */
    recievedMessage (event) {
      try {
        const answerFromSocket = JSON.parse(event.data)
        const message = document.createElement('div')
        message.textContent = answerFromSocket.data
        this.#chatBox.appendChild(message)
      } catch (error) {
        console.error(error.message)
      }
    }

    /**
     * A function that sends the message to the socketserver.
     *
     */
    sendMessage () {
      try {
        const datas = this.#message.value
        const apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
        const userName = this.#userName.value
        const socketMessage = {
          type: 'message',
          data: datas,
          username: userName,
          channel: 'my, not so secret, channel',
          key: apiKey
        }
        this.#socket.send(JSON.stringify(socketMessage))
        this.#message.value = ''
      } catch (error) {
        console.error(error.message)
      }
    }

    /**
     * Called when element is removed from the DOM.
     *
     */
    disconnectedCallback () {
      this.#socket.close()
      this.#abortController.abort()
    }
  }
)
