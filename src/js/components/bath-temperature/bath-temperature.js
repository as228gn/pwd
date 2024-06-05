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
  color: rgb(60, 116, 220);
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
  width: 590px;
  height: 490px;
  font-family: sans-serif;
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
    constructor() {
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

    connectedCallback() {
      this.getBathLocation()
    }

    async getBathLocation() {
      let response = await fetch('https://badplatsen.havochvatten.se/badplatsen/api/feature')

      if (!response.ok) {
        console.log(response.status)
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
    }

    populateDropdown(data) {
      this.#dropDown.textContent = '' // Rensa befintliga alternativ

      data.forEach(item => {
        const option = document.createElement('option')
        option.value = item.NUTSKOD // Eller annan lämplig egenskap som värde
        option.text = item.NAMN // Texten som visas i dropdown
        this.#dropDown.appendChild(option)
      })

      this.#dropDown.addEventListener('change', (event) => { this.findBathTemp(event) })
    }

    async findBathTemp(event) {
      const nutskod = event.target.value
      console.log('Användaren valde:', nutskod)
      let response = await fetch(`${'https://badplatsen.havochvatten.se/badplatsen/api/detail/'}${nutskod}`)

      if (!response.ok) {
        console.log(response.status)
      }

      response = await response.json()
      const temp = response.sampleTemperature
      const algae = response.algalText
      const info = response.bathInformation
      this.#temp.textContent = 'Vattentemperatur: ' + temp + '°C'
      this.#algae.textContent = 'Algblommning: ' + algae
      this.#info.textContent = info
    }
  }
)
