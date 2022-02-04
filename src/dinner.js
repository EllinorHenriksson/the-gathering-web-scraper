/**
 * The dinner module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Represents the dinner page.
 */
export class Cinema {
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
    this.url = url
  }

  /**
   * Gets the value of this.#url.
   *
   * @returns {string} The url.
   */
  get url () {
    return this.#url
  }

  /**
   * Sets the value of this.#url to url, with modifications if necessary.
   *
   * @param {string} url - The url.
   */
  set url (url) {
    if (!url.endsWith('/')) {
      url += '/'
    }
    this.#url = url
  }
}
