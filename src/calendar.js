/**
 * The calendar module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import { WebScraper } from './web-scraper.js'

/**
 * Represents the calendar page.
 */
export class Calendar {
  /**
   * The url of the Calendar page.
   *
   * @type {string}
   */
  #url

  /**
   * An instance of WebScraper.
   *
   * @type {WebScraper}
   */
  #webScraper = new WebScraper()

  /**
   * Creates an instance of Calendar.
   *
   * @param {string} url - The URL of the Calendar page.
   */
  constructor (url) {
    this.#url = url
  }

  /**
   * Returns the days when all friends are free.
   *
   * @returns {string[]} An array with the days.
   */
  async freeDaysAll () {
    const linksToCalendars = await this.#getLinks()
    const freeDaysPaulPromise = this.#freeDays(linksToCalendars.paul)
    const freeDaysPeterPromise = this.#freeDays(linksToCalendars.peter)
    const freeDaysMaryPromise = this.#freeDays(linksToCalendars.mary)

    const freeDays = await Promise.all(freeDaysPaulPromise, freeDaysPeterPromise, freeDaysMaryPromise)
    return [...new Set(freeDays.flat())]
  }

  /**
   * Returns an object with links to each person's calendar.
   *
   * @returns {object} An object with the links paired with keys for each person.
   */
  async #getLinks () {
    const links = await this.#webScraper.scrapeLinks(this.#url) // FORTSÄTT HÄR!!! Se till att relativa länkar tas med
    // och konkatenera med början av den absoluta url:en.
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
      if (link.includes('paul')) {
        linksObject.paul = link
      } else if (link.includes('peter')) {
        linksObject.peter = link
      } else if (link.includes('mary')) {
        linksObject.mary = link
      }
    })

    return linksObject
  }

  /**
   * Returns an array with the days when a person is free.
   *
   * @param {string} url - The url to the persons calendar.
   * @returns {string []} An array with the free days.
   */
  async #freeDays (url) {
    const allDays = await this.#webScraper.scrapeText(url, 'td').map(text => text.toLowerCase())

    const freeDays = []
    for (let i = 0; i < allDays; i++) {
      let day
      switch (i) {
        case 0:
          day = 'friday'
          break
        case 1:
          day = 'saturday'
          break
        case 2:
          day = 'sunday'
          break
      }

      if (allDays[i].includes('ok')) {
        freeDays.push(day)
      }
    }

    return freeDays
  }
}
