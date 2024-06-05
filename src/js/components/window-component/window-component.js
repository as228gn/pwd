/**
 * The window-component web component module.
 *
 * @author Anna Ståhlberg <as228gn@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
.window {
  position: absolute;
  width: 600px;
  height: 550px;
  background-color: white;
  border: 5px solid grey;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  cursor: grab;
  overflow: scroll;
  z-index: 1;
}

.header {
  display: flex;
  justify-content: right;
  padding: 10px;
  cursor: move;
  background: linear-gradient(to bottom, #ccc, #999);
  padding: 5px;
  border-bottom: 2px solid #000;
}

.content {
  padding: 10px;
} 

</style>
<div class="window">
  <div id="header" class="header"><button class="close">X</button></div>
  <div class="content">
  </div>
</div>
`

customElements.define('window-component',
  /**
   * Represents a window-component element.
   */
  class extends HTMLElement {
    #window
    #header
    #close
    #abortController
    #pos1 = 0
    #pos2 = 0
    #pos3 = 0
    #pos4 = 0

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
      this.#window = this.shadowRoot.querySelector('.window')
      this.#header = this.shadowRoot.querySelector('.header')
      this.#close = this.shadowRoot.querySelector('.close')
    }

    connectedCallback () {
      this.#header.addEventListener('mousedown', (event) => { this.dragMouseDown(event) })
      this.#close.addEventListener('click', (event) => { this.removeFromDom(event) })
      const component = this
      component.addEventListener('click', (event) => { this.focusOnClick()})
    }

    removeFromDom () {
      const component = this
      component.parentNode.removeChild(component)
    }

    focusOnClick () {
      const ev = new CustomEvent('zIndex', {
        bubbles: true,
        composed: true
      })

      this.dispatchEvent(ev)
    }

    dragMouseDown (event) {
      event.preventDefault()

      this.focusOnClick()

      this.#abortController = new AbortController()
      this.#pos3 = event.clientX
      this.#pos4 = event.clientY

      this.shadowRoot.addEventListener('mousemove', (event) => { this.elementDrag(event) }, { signal: this.#abortController.signal })
      this.shadowRoot.addEventListener('mouseup', (event) => { this.closeDragElement() }, { signal: this.#abortController.signal })
    }

    elementDrag(event) {
      event.preventDefault()
      // Beräkna nya muspositionen
      this.#pos1 = this.#pos3 - event.clientX
      this.#pos2 = this.#pos4 - event.clientY
      this.#pos3 = event.clientX
      this.#pos4 = event.clientY

      // Uppdatera elementets position
      this.#window.style.top = (this.#window.offsetTop - this.#pos2) + 'px'
      this.#window.style.left = (this.#window.offsetLeft - this.#pos1) + 'px'
    }

    closeDragElement() {
      // Ta bort eventlyssnare
      this.#abortController.abort()
    }
  }
)
