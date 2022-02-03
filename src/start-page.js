/**
 * The start page module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import { WebScraper } from './web-scraper.js'

/**
 * Represents the start page.
 */
export class StartPage {
  /**
   * The URL of the start page.
   *
   * @type {string}
   */
  #url

  /**
   * Creates a StartPage instance.
   *
   * @param {string} url - The URL of the start page.
   */
  constructor (url) {
    this.#url = url
  }

  /**
   * Returns the absolute links on the page of this.#url.
   *
   * @returns {object} An object with the links paired with keys (calendar, cinema, dinner).
   */
  async getLinks () {
    const webScraper = new WebScraper()
    const links = await webScraper.scrapeLinks(this.#url)
    return this.#sortLinks(links)
  }

  /**
   * Pairs the links in the passed array with a corresponding key in an object.
   *
   * @param {string[]} links - The array with links.
   * @returns {object} An object with the links each paired with a key.
   */
  #sortLinks (links) {
    const linksObject = {}

    links.forEach(link => {
      if (link.includes('calendar')) {
        linksObject.calendar = link
      } else if (link.includes('cinema')) {
        linksObject.cinema = link
      } else if (link.includes('dinner')) {
        linksObject.dinner = link
      }
    })

    return linksObject
  }
}
