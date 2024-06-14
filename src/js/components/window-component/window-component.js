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
  overflow: scroll;
  z-index: 1;
}

.header {
  display: flex;
  justify-content: right;
  padding: 10px;
  cursor: grab;
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

      this.#window = this.shadowRoot.querySelector('.window')
      this.#header = this.shadowRoot.querySelector('.header')
      this.#close = this.shadowRoot.querySelector('.close')
    }

    /**
     * Eventlisteners.
     */
    connectedCallback () {
      this.#header.addEventListener('mousedown', (event) => { this.dragMouseDown(event) })
      this.#close.addEventListener('click', (event) => { this.removeFromDom(event) })
      this.addEventListener('click', (event) => { this.focusOnClick() })
    }

    /**
     * A function that removes the component from the DOM.
     *
     */
    removeFromDom () {
      this.parentNode.removeChild(this)
      this.#abortController.abort()
    }

    /**
     * A function that gives the component focus if clicked.
     *
     */
    focusOnClick () {
      const event = new CustomEvent('zIndex', {
        bubbles: true,
        composed: true
      })

      this.dispatchEvent(event)
    }

    /**
     * A function that gives the component its starting position.
     *
     * @param {event} event A mousedown event.
     */
    dragMouseDown (event) {
      event.preventDefault()

      this.focusOnClick()

      this.#abortController = new AbortController()
      this.#pos3 = event.clientX
      this.#pos4 = event.clientY

      this.shadowRoot.addEventListener('mousemove', (event) => { this.elementDrag(event) }, { signal: this.#abortController.signal })
      this.shadowRoot.addEventListener('mouseup', (event) => { this.closeDragElement() }, { signal: this.#abortController.signal })
    }

    /**
     * A function that enables the component to being moved across the DOM.
     *
     * @param {event} event A mousemove event.
     */
    // The logic how to move elements around the DOM I got from chatGPT
    elementDrag (event) {
      event.preventDefault()
      // Calculate the new position
      this.#pos1 = this.#pos3 - event.clientX
      this.#pos2 = this.#pos4 - event.clientY
      this.#pos3 = event.clientX
      this.#pos4 = event.clientY

      // Uppdate the position
      this.#window.style.top = (this.#window.offsetTop - this.#pos2) + 'px'
      this.#window.style.left = (this.#window.offsetLeft - this.#pos1) + 'px'
    }

    /**
     * Removes the eventlisteners when the component are being dropped.
     *
     */
    closeDragElement () {
      this.#abortController.abort()
    }
  }
)
