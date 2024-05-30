/**
 * The memory-game web component module.
 *
 * @author Anna Ståhlberg <as228gn@student.lnu.se>
 * @version 1.1.0
 */

import '../flipping-card'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #game {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Anpassa efter behov */
      gap: 10px;
    }
    
</style>
  <div id="game">
  </div>
`

customElements.define('memory-game',
  /**
   * Represents a memory-game element.
   */
  class extends HTMLElement {
    #game

    /**
     * Creates an instance of the current type.
     */
    constructor() {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#game = this.shadowRoot.querySelector('#game')
    }

    connectedCallback() { 
      this.renderCards()
    }

    renderCards() {
      const cards = [
        '../images/0.png',
        '../images/0.png',
        '../images/1.png',
        '../images/1.png',
        '../images/2.png',
        '../images/2.png',
        '../images/3.png',
        '../images/3.png',
        '../images/4.png',
        '../images/4.png',
        '../images/5.png',
        '../images/5.png',
        '../images/6.png',
        '../images/6.png',
        '../images/7.png',
        '../images/7.png',
        '../images/8.png',
        '../images/8.png']
      cards.sort(() => Math.random() - 0.5)
      cards.forEach((image) => {
        const card = document.createElement('flipping-card')
        card.setAttribute('image', image)
        this.#game.appendChild(card)
      })
    }
  }
)