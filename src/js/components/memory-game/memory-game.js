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
.grid-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* Justera antalet kolumner beroende på hur du vill arrangera korten */
  gap: 10px; /* Avstånd mellan rutorna */
}
  .pair {
    background-color: rgb(229, 138, 237);
    width: 150px;
    height: 200px;
    border-radius: 10px;
  }

  .invisible {
    visibility: hidden;
}
    
</style>
  <div id="game" class="grid-container"></div>
  <div id="playAgain"><input type="text"></div>
`

customElements.define('memory-game',
  /**
   * Represents a memory-game element.
   */
  class extends HTMLElement {
    #game
    #imageToCheck = ''
    #attemptedTries = []

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
        '../images/7.png']
      let count = 1
      const sortedCards = []
      cards.forEach((image) => {
        const card = document.createElement('flipping-card')
        card.setAttribute('image', image)
        card.setAttribute('data-id', count)
        card.classList.add('start')
        sortedCards.push(card)

        const card2 = document.createElement('flipping-card')
        card2.setAttribute('image', image)
        card2.setAttribute('data-id', count)
        card2.classList.add('start')
        sortedCards.push(card2)

        count++
      })
      sortedCards.sort(() => Math.random() - 0.5)
      const positions = [
        [1, 1], [1, 2], [1, 3], [1, 4],
        [2, 1], [2, 2], [2, 3], [2, 4],
        [3, 1], [3, 2], [3, 3], [3, 4],
        [4, 1], [4, 2], [4, 3], [4, 4]
      ]
      sortedCards.forEach((card, index) => {
        const [row, col] = positions[index]
        card.style.gridRow = row
        card.style.gridColumn = col
        this.#game.appendChild(card)
        card.addEventListener('checkCard', (event) => { this.checkImages(event) })
      })
    }

    checkImages(event) {
      this.#attemptedTries.push(event.detail.cardId)
      const currentFlippedCards = this.shadowRoot.querySelectorAll('.flipped')
      if (currentFlippedCards.length > 1) {
        currentFlippedCards.forEach((card) => {
          card.classList.remove('flipped')
          card.shadowRoot.querySelector('.card').style.removeProperty('background-image')
        })
        this.#imageToCheck = ''
      }

      event.target.classList.add('flipped')
      if (this.#imageToCheck.length === 0) {
        this.#imageToCheck = event.detail.cardId
      } else {
        if (this.#imageToCheck === event.detail.cardId) {
          const cards = this.shadowRoot.querySelectorAll('[data-id="' + event.detail.cardId + '"]')

          cards.forEach((card) => {
            card.classList.add('pair')
            card.classList.remove('flipped')
            setTimeout(function () {
              if (card) {
                card.classList.add('invisible')
              }
            }, 2000)
          })
          this.#imageToCheck = ''
        }
      }

      const cards = this.shadowRoot.querySelectorAll('.start')
      if (this.isGameFinnished(cards)) {
        const tries = this.#attemptedTries.length / 2
        console.log('Du klarade det på ' + tries + ' försök!')
      }
    }

    isGameFinnished (cards) {
      return Array.from(cards).every(card => card.classList.contains('pair'))
    }
  }
)
