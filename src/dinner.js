/**
 * The dinner module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

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

  getFreeTables (day) {
    return []
  }
}
