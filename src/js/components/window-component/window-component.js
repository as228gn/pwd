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
  height: 500px;
  border: 1px solid #000;
  background-color: #f1f1f1;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  cursor: grab;
  overflow: scroll;
  z-index: 1;
}

.header {
  background-color: #2196F3;
  color: #fff;
  padding: 10px;
  cursor: move;
}

.content {
  padding: 10px;
} 
</style>
<div class="window">
  <div id="header" class="header">Click here to move <button class="close">X</button></div>
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
    }

    removeFromDom () {
      const component = this
      component.parentNode.removeChild(component)
    }

    dragMouseDown (event) {
      event.preventDefault()

      const ev = new CustomEvent('zIndex', {
        bubbles: true,
        composed: true
      })

      this.dispatchEvent(ev)

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
