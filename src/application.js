/**
 * The application module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import { Calendar } from './calendar.js'
import validator from 'validator'
import { StartPage } from './start-page.js'

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
    this.#url = url
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
    // Scrape start page for links to calendar, cinema and restaurant.
    const startPage = new StartPage(this.#url)
    const links = await startPage.getLinks()

    // Scrape calendar page for links to Paul, Peter and Mary, and scrape their pages for free days.
    const calendar = new Calendar(links.calendar)
    const freeDays = await calendar.freeDaysAll()

    // FORTSÄTT HÄR!!!
    // Start two asyncronus tasks (check movies, check restaurant - for the day(s) when all friends can meet)
  }
}
