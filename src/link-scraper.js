/**
 * The link scraper module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

/**
 * Represents a link scraper.
 */
export class LinkScraper {
  /**
   * Scrape links from the passed URL.
   *
   * @param {string} url - The URL to scrape links from.
   * @returns {object} An object with the scraped links.
   */
  async scrapeLinks (url) {
    const response = await fetch(url)

    this.#checkStatusCode(response)

    const text = await response.text()

    const dom = new JSDOM(text)
    const linksArray = Array.from(dom.window.document.querySelectorAll('a[href^="http://"], a[href^="https://"]')).map(ancor => ancor.href)

    return this.#sortLinks(linksArray)
  }

  /**
   * Pairs the links in the passed array with a corresponding key in an object.
   *
   * @param {string[]} linksArray - The array with links.
   * @returns {object} An object with the links each paired with a key.
   */
  #sortLinks (linksArray) {
    const linksObject = {
      calendar: '',
      cinema: '',
      dinner: ''
    }

    linksArray.forEach(link => {
      if (link.contains('calendar')) {
        linksObject.calendar = link
      } else if (link.contains('cinema')) {
        linksObject.cinema = link
      } else if (link.contains('dinner')) {
        linksObject.dinner = link
      }
    })

    return linksObject
  }

  /**
   * Checks the the status code of a response and throws an exception if not ok.
   *
   * @param {object} response - The response object to check.
   */
  #checkStatusCode (response) {
    if (!response.ok) {
      throw new Error(`HTTP Error Response: ${response.status} ${response.statusText}`)
    }
  }
}
