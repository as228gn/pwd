/**
 * The main script file of the application.
 *
 * @author Anna Ståhlberg <as228gn@student.lnu.se>
 * @version 1.0.0
 */
import './components/memory-game/index.js'
import './components/chat-application/index.js'
import './components/window-component/index.js'
import './components/bath-temperature/index.js'

// Give focus to the component being clicked
document.addEventListener('zIndex', (event) => {
  let highestIndex = 1
  const components = document.querySelectorAll('window-component')

  components.forEach(comp => {
    const div = comp.shadowRoot.querySelector('.window')
    const style = window.getComputedStyle(div)
    const zindex = parseInt(style.zIndex)

    if (zindex > highestIndex) {
      highestIndex = zindex
    }
  })

  highestIndex++
  event.target.shadowRoot.querySelector('.window').style.zIndex = highestIndex
})

const bathButton = document.getElementById('bathButton')
bathButton.addEventListener('click', () => {
  const newWindow = document.createElement('window-component')
  const newMemory = document.createElement('bath-temperature')
  const content = newWindow.shadowRoot.querySelector('.content')
  content.appendChild(newMemory)
  document.body.appendChild(newWindow)
})

const memoryButton = document.getElementById('memoryButton')
memoryButton.addEventListener('click', () => {
  const newWindow = document.createElement('window-component')
  const newMemory = document.createElement('memory-game')
  const content = newWindow.shadowRoot.querySelector('.content')
  content.appendChild(newMemory)
  document.body.appendChild(newWindow)
})

const chatButton = document.getElementById('chatButton')
chatButton.addEventListener('click', () => {
  const newWindow = document.createElement('window-component')
  const newChat = document.createElement('chat-application')
  const content = newWindow.shadowRoot.querySelector('.content')
  content.appendChild(newChat)
  document.body.appendChild(newWindow)
})
