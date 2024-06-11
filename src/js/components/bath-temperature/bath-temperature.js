/**
 * The bath-temperature web component module.
 *
 * @author Anna Ståhlberg <as228gn@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style> 
#bath {
  color: cadetblue;
}
.vaal {
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

#containerVaal {
  height: 100px;
}

#container {
  font-family: sans-serif;
}

.bathTitle {
  color: cadetblue;
}

</style>
<div id="container">
  <h1 id="bath">Badinfo Kalmar och Öland</h1>
  <div>Välj badplats</div>
  <select id="dropDown">Namn</select>
  <div id="containerVaal">  
    <div class="vaal" id="temp"></div>
    <div class="vaal" id="algae"></div>
  </div>  
  <h2 class="bathTitle">Information om badplatsen</h2>
  <div id="info"></div>
</div>  
`

customElements.define('bath-temperature',
  /**
   * Represents a bath-temperature element.
   */
  class extends HTMLElement {
    #dropDown
    #temp
    #algae
    #info
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#dropDown = this.shadowRoot.querySelector('#dropDown')
      this.#temp = this.shadowRoot.querySelector('#temp')
      this.#algae = this.shadowRoot.querySelector('#algae')
      this.#info = this.shadowRoot.querySelector('#info')
    }

    /**
     * The function to start with.
     */
    connectedCallback () {
      this.getBathLocation()
    }

    /**
     * A function that fetches the bathlocations in Kalmar and Öland.
     *
     *
     */
    async getBathLocation () {
      try {
        let response = await fetch('https://badplatsen.havochvatten.se/badplatsen/api/feature')

        if (!response.ok) {
          throw new Error()
        }

        response = await response.json()
        const data = response.features
        const selectedFeatures = data.filter(feature => {
          return feature.properties.KMN_NAMN === 'Kalmar' || feature.properties.KMN_NAMN === 'Mörbylånga' || feature.properties.KMN_NAMN === 'Färjestaden'
        })
        const extractedData = selectedFeatures.map(feature => ({
          NAMN: feature.properties.NAMN,
          KMN_NAMN: feature.properties.KMN_NAMN,
          NUTSKOD: feature.properties.NUTSKOD
        }))
        this.populateDropdown(extractedData)
      } catch (error) {
        console.error(error.message)
      }
    }

    /**
     * A function that puts the bathlocations in a dropdown menu.
     *
     * @param {Array} data The locations to be put in the dropdown menu.
     */
    populateDropdown (data) {
      this.#dropDown.textContent = ''

      data.forEach(item => {
        const option = document.createElement('option')
        option.value = item.NUTSKOD
        option.text = item.NAMN
        this.#dropDown.appendChild(option)
      })

      this.#dropDown.addEventListener('change', (event) => { this.findBathTemp(event) })
    }

    /**
     * A function that fetches the information to show.
     *
     * @param {event} event An event that contains the value to find the information with.
     */
    async findBathTemp (event) {
      try {
        const nutskod = event.target.value
        let response = await fetch(`${'https://badplatsen.havochvatten.se/badplatsen/api/detail/'}${nutskod}`)

        if (!response.ok) {
          throw new Error()
        }

        response = await response.json()
        const temp = response.sampleTemperature
        const algae = response.algalText
        const info = response.bathInformation
        this.#temp.textContent = 'Vattentemperatur: ' + temp + '°C'
        this.#algae.textContent = 'Algblommning: ' + algae
        this.#info.textContent = info
      } catch (error) {
        console.error(error.message)
      }
    }
  }
)
