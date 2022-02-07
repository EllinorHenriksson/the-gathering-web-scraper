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
   * Scrapes links from the passed URL.
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
   * Scrapes text from the passed URL.
   *
   * @param {string} url - The URL to scrape.
   * @param {string} selector - The css query selector to select what elements to scrape text from.
   * @returns {string[array]} An array with the scraped text.
   */
  async scrapeText (url, selector) {
    const dom = await this.#getDom(url)
    return Array.from(dom.window.document.querySelectorAll(selector)).map(element => element.textContent)
  }

  /**
   * Scrapes the value of the value attribute for selected elements on the requested page.
   *
   * @param {string} url - The URL to scrape.
   * @param {object} options - An options object to pass when fetching the resource.
   * @param {string} selector - The css query selector to select what elements to scrape attribute values from.
   * @returns {string[]} An array with the scraped attribute values.
   */
  async scrapeValue (url, options, selector) {
    const dom = await this.#getDom(url, options)
    return Array.from(dom.window.document.querySelectorAll(selector)).map(element => element.value)
  }

  /**
   * Scrapes JSON data from the passed URL.
   *
   * @param {string} url - The URL to scrape.
   * @returns {*} A value of the data type corresponding to the given JSON text.
   */
  async scrapeData (url) {
    const response = await this.#getResponse(url)
    const text = await response.text()
    return JSON.parse(text)
  }

  /**
   * Returns a JSDOM object with the text of a requested page.
   *
   * @param {string} url - The url of the requested page.
   * @param {object} options - An options object to pass when fetching the resource (optional).
   * @returns {JSDOM} A JSDOM object.
   */
  async #getDom (url, options) {
    const response = await this.#getResponse(url, options)
    const text = await response.text()
    return new JSDOM(text)
  }

  /**
   * Fetches the requested resource and returns a response object.
   *
   * @param {string} url - The url of the requested resource.
   * @param {object} options - An options object to pass when fetching the resource (optional).
   * @returns {Response} The response object.
   */
  async #getResponse (url, options) {
    let response
    if (options) {
      response = await fetch(url, options)
    } else {
      response = await fetch(url)
    }
    return this.#checkStatusCode(response)
  }

  /**
   * Checks the the status code of a response, redirects if necessary and throws an exception if not ok.
   *
   * @param {Response} response - The response object to check.
   * @throws {Error} An Error object.
   * @returns {Response} A response object.
   */
  async #checkStatusCode (response) {
    if (response.status === 301 || response.status === 302) {
      return this.#getRedirect(response)
    } else if (response.status >= 400 && response.status < 600) {
      throw new Error(`HTTP Error Response: ${response.status} ${response.statusText}`)
    } else {
      return response
    }
  }

  /**
   * Performs a redirection.
   *
   * @param {Response} response - The original response object.
   * @returns {Response} The response object obtained from the redirection.
   */
  async #getRedirect (response) {
    const locationURL = new URL(response.headers.get('location'), response.url)
    const cookie = response.headers.raw()['set-cookie']
    const sessionCookie = cookie[0].slice(0, cookie[0].indexOf(';'))

    return fetch(locationURL, {
      headers: {
        cookie: sessionCookie
      }
    })
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
