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
  .pair {
    background-color: rgb(229, 138, 237);
    width: 150px;
    height: 200px;
    border-radius: 10px;
  }
  .notPair {
    background-image: url('../images/lnu-symbol.png');
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
    #imageToCheck = ''

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
        '../images/1.png',
        '../images/2.png',
        '../images/3.png',
        '../images/4.png',
        '../images/5.png',
        '../images/6.png',
        '../images/7.png',
        '../images/8.png']
      let count = 1
      const sortedCards = []
      cards.forEach((image) => {
        const card = document.createElement('flipping-card')
        card.setAttribute('image', image)
        card.setAttribute('data-id', count)
        sortedCards.push(card)

        const card2 = document.createElement('flipping-card')
        card2.setAttribute('image', image)
        card2.setAttribute('data-id', count)
        sortedCards.push(card2)

        count++
      })
      //sortedCards.sort(() => Math.random() - 0.5)
      sortedCards.forEach((card) => {
        this.#game.appendChild(card)
        card.addEventListener('checkCard', (event) => { this.checkImages(event) })
      })
    }

    checkImages(event) {
      const currentFlippedCards = this.shadowRoot.querySelectorAll('.flipped')
console.log(currentFlippedCards)
      if (currentFlippedCards.length > 1) {
        currentFlippedCards.forEach((card) => {
          card.classList.remove('flipped')
          card.shadowRoot.querySelector('.card').style.removeProperty('background-image')
        })
      }

      event.target.classList.add('flipped')
      if (this.#imageToCheck.length === 0) {
        this.#imageToCheck = event.detail.cardId
      } else {
        if (this.#imageToCheck === event.detail.cardId) {
          const cards = this.shadowRoot.querySelectorAll('[data-id="' + event.detail.cardId + '"]')

          cards.forEach((card) => {
            //card.classList.add('pair')
            card.classList.remove('flipped')
            // setTimeout(function () {
            //   if (card) {
            //     card.remove()
            //   }
            // }, 2000)
          })
          this.#imageToCheck = ''
        }
      }
    }
  }
)
