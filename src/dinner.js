/**
 * The dinner module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import { WebScraper } from './web-scraper.js'

/**
 * Represents the dinner page.
 */
export class Dinner {
  /**
   * The url of the dinner page.
   *
   * @type {string}
   */
  #url

  /**
   * Creates an instance of Dinner.
   *
   * @param {string} url - The URL of the dinner page.
   */
  constructor (url) {
    this.#url = url
  }

  async getFreeTables (day) {
    const webScraper = new WebScraper()

    const params = new URLSearchParams()
    params.append('username', 'zeke')
    params.append('password', 'coys')

    const options = {
      method: 'POST',
      body: params,
      redirect: 'manual'
    }

    const freeTables = await webScraper.scrapeValue(this.#url + 'login', options, 'input[type="radio"]')

    // FORTSÄTT HÄR!!!

    // Filtrera för den aktuella dagen

    // return []
  }
}
