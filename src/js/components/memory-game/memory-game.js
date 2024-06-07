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
  gap: 10px;
  margin-top: 20px;
}
  .pair {
    background-color: rgb(229, 138, 237);
    width: 70px;
    height: 90px;
    border-radius: 10px;
  }

  .invisible {
    visibility: hidden;
}

.tries {
  display: none;
}

.container {
  display: flex;
  justify-content: center;
}

.hidden {
  display: none;
 }

 #triesDiv {
  margin-left: 100px;
 }

 .buttonGame {
 padding: 10px 20px;
 font-size: 14px;
 color: white;
 background-color: cadetblue;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 }
    
</style>
<audio id="victorySound" src="../audio/cheer.wav"></audio>
<div class="container">
  <div id="gameButtons">
    <button class="buttonGame" id="game16">Spela med 16 brickor</button>
    <button class="buttonGame" id="game8">Spela med 8 brickor</button>
    <button class="buttonGame" id="game4">Spela med 4 brickor</button>
  </div>
</div>
<div class="container">  
  <div id="game" class="grid-container"></div>
</div>
<h1 id="triesDiv" class="tries"></h1>
  `

customElements.define('memory-game',
  /**
   * Represents a memory-game element.
   */
  class extends HTMLElement {
    #game
    #imageToCheck = ''
    #attemptedTries = []
    #game16
    #game8
    #game4
    #victorySound
    #triesDiv
    #cards16 = [
      '../images/0.png',
      '../images/1.png',
      '../images/2.png',
      '../images/3.png',
      '../images/4.png',
      '../images/5.png',
      '../images/6.png',
      '../images/7.png']

    #cards8 = [
      '../images/0.png',
      '../images/1.png',
      '../images/2.png',
      '../images/3.png']

    #cards4 = [
      '../images/0.png',
      '../images/1.png']

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#game = this.shadowRoot.querySelector('#game')
      this.#game16 = this.shadowRoot.querySelector('#game16')
      this.#game8 = this.shadowRoot.querySelector('#game8')
      this.#game4 = this.shadowRoot.querySelector('#game4')
      this.#victorySound = this.shadowRoot.querySelector('#victorySound')
      this.#triesDiv = this.shadowRoot.querySelector('#triesDiv')
    }

    /**
     * Eventlisteners.
     */
    connectedCallback () {
      this.#game16.addEventListener('click', (event) => { this.renderCards(this.#cards16) })
      this.#game8.addEventListener('click', (event) => { this.renderCards(this.#cards8) })
      this.#game4.addEventListener('click', (event) => { this.renderCards(this.#cards4) })
    }

    /**
     * A function that duplicates the cards, sorts them and puts them in a grid.
     *
     * @param {Array} cards The cards to use in the game.
     */
    renderCards (cards) {
      this.#triesDiv.classList.add('hidden')
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

    /**
     * A function that holds the gamelogic, checks if the cards matches, if they do takes them out of the game and if they don´t flipps them back. It also holds the count of your tries.
     *
     * @param {event} event A flipped-card event.
     */
    checkImages (event) {
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
        const attempts = this.#attemptedTries.length / 2
        const tries = this.shadowRoot.getElementById('triesDiv')
        tries.textContent = 'Du klarade det på ' + attempts + ' försök!'
        tries.classList.remove('tries')
        this.playVictorySound()
        this.#triesDiv.classList.remove('hidden')
      }
    }

    /**
     * A function that checks if the game is finnished.
     *
     * @param {Array} cards The cards to be checked.
     * @returns {boolean} True if all the cards contains class pair.
     */
    isGameFinnished (cards) {
      return Array.from(cards).every(card => card.classList.contains('pair'))
    }

    /**
     * Plays a victorysound if the game is finnished.
     *
     */
    playVictorySound () {
      this.#victorySound.play()
      console.log('spela')
    }
  }
)
