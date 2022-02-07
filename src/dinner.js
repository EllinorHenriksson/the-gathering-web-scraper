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
   * The free tables (day and time) for all days.
   *
   * @type {string[]}
   */
  #freeTablesAllDays

  /**
   * Creates an instance of Dinner.
   *
   * @param {string} url - The URL of the dinner page.
   */
  constructor (url) {
    this.#url = url
  }

  /**
   * Gets the free tables for a specific day (Friday, Saturday or Sunday).
   *
   * @param {string} day - The day to look for free tables.
   * @returns {string[]} An array with the free tables for that day.
   */
  async getFreeTables (day) {
    if (!this.#freeTablesAllDays) {
      this.#freeTablesAllDays = await this.#getFreeTablesAllDays()
    }

    let start
    switch (day) {
      case 'Friday':
        start = 'fri'
        break
      case 'Saturday':
        start = 'sat'
        break
      case 'Sunday':
        start = 'sun'
        break
    }

    const freeTablesSpecificDay = []

    this.#freeTablesAllDays.forEach(table => {
      if (table.startsWith(start)) {
        freeTablesSpecificDay.push(`${table.substring(3, 5)}:00-${table.substring(5)}:00`)
      }
    })

    return freeTablesSpecificDay
  }

  /**
   * Gets the free tables for all days (Friday, Saturday and Sunday).
   *
   * @returns {string[]} An array with the free tables (day and time).
   */
  async #getFreeTablesAllDays () {
    const webScraper = new WebScraper()

    const params = new URLSearchParams()
    params.append('username', 'zeke')
    params.append('password', 'coys')

    const options = {
      method: 'POST',
      body: params,
      redirect: 'manual'
    }

    return webScraper.scrapeValue(this.#url + 'login', options, 'input[type="radio"]')
  }
}
