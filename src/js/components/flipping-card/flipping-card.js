/**
 * The flipping-card web component module.
 *
 * @author Anna Ståhlberg <as228gn@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #card {
        width: 150px;
        height: 200px;
        border: solid black;
        border-radius: 10px;
        background-image: url('../images/lnu-symbol.png');
        background-size: cover; /* Bilden täcker hela div */
        background-position: center; /* Bilden centreras */
        background-repeat: no-repeat; /* Bilden upprepas inte */
        display: block;
    }  
</style>
  <div id="card">
  </div>
`

customElements.define('flipping-card',
  /**
   * Represents a flipping-card element.
   */
  class extends HTMLElement {
    #card
    #sameImageController = []

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#card = this.shadowRoot.querySelector('#card')
    }

    connectedCallback () {
      this.#card.addEventListener('click', (event) => { this.flipHandler() })
    }

    flipHandler () {
      const image = this.getAttribute('image')
      this.#card.style.backgroundImage = `url('${image}')`
      this.#sameImageController.push(image)
      console.log(this.#sameImageController)
    }
  }
)
