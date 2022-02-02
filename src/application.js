/**
 * The application module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import validator from 'validator'

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

  run () {
    // FORTSÄTT HÄR
  }
}
