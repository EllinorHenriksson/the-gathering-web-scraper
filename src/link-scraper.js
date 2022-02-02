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
   * @returns {string[]} An array with the scraped links.
   */
  async scrapeLinks (url) {
    const response = await fetch(url)
    const text = await response.text()

    const dom = new JSDOM(text)
    // FORTSÄTT HÄR - Work with DOM

    return [] // Byt till array med scraped links
  }
}
