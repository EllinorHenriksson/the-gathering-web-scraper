/**
 * The application module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import validator from 'validator'
import { LinkScraper } from './link-scraper.js'

/**
 * Represents a Node application.
 */
export class Application {
  /**
   * The URL to scrape.
   *
   * @param {string} url
   */
  #url

  /**
   * Creates an instance of the class Application.
   *
   * @param {string} url - The URL to scrape.
   */
  constructor (url) {
    this.url = url
  }

  /**
   * Returns the value for the this.#url string.
   *
   * @returns {string} The this.#url string.
   */
  get url () {
    return this.#url
  }

  /**
   * Validates the URL and sets the value of this.#url to the passed argument.
   *
   */
  set url (url) {
    if (!url) {
      throw new Error('No URL was passed as an argument.')
    } else if (!validator.isURL(url)) {
      throw new Error('The passed argument is not a valid URL.')
    }
  }

  /**
   * Runs the application.
   */
  async run () {
    // Scrape link for urls to calendar, cinema and restaurant
    const linkScraper = new LinkScraper()
    const linksObject = await linkScraper.scrapeLinks(url)

    // FORTSÄTT HÄR!!!
    // Start two asyncronus tasks (check movies, check restaurant - for the day(s) when all friends can meet)
  }
}
