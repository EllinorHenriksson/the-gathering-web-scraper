/**
 * The web scraper module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import validator from 'validator'

/**
 * Represents a web scraper.
 */
export class WebScraper {
  /**
   * Scrape links from the passed URL.
   *
   * @param {string} url - The URL to scrape links from.
   * @returns {string[array]} An array with the scraped links.
   */
  async scrapeLinks (url) {
    if (!url.endsWith('/')) {
      url += '/'
    }

    const dom = await this.#getDom(url)
    const links = Array.from(dom.window.document.querySelectorAll('a[href]')).map(ancor => ancor.href)

    const absoluteLinks = links.map(link => {
      if (link.startsWith('./')) {
        return url + link.slice(2)
      } else if (link.startsWith('http')) {
        return link
      } else {
        throw new Error('At least one of the scraped links does not start with http or ./')
      }
    })

    this.#checkLinks(absoluteLinks)

    return absoluteLinks
  }

  /**
   * Returns a JSDOM object with the text of the requested resource.
   *
   * @param {string} url - The requested url.
   * @returns {JSDOM} A JSDOM object.
   */
  async #getDom (url) {
    const response = await fetch(url)
    this.#checkStatusCode(response)
    const text = await response.text()
    return new JSDOM(text)
  }

  /**
   * Scrape text from the passed URL.
   *
   * @param {string} url - The URL to scrape text from.
   * @param {string} selector - The css query selector to select what elements to scrape text from.
   * @returns {string[array]} An array with the scraped text.
   */
  async scrapeText (url, selector) {
    const dom = await this.#getDom(url)
    return Array.from(dom.window.document.querySelectorAll(selector)).map(element => element.textContent)
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

  /**
   * Checks if the scraped links are valid URLs.
   *
   * @param {string[]} links - The links to check.
   */
  #checkLinks (links) {
    links.forEach(link => {
      if (!validator.isURL(link)) {
        throw new Error(`${link} is not a valid URL.`)
      }
    })
  }
}
