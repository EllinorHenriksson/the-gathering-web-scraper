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
  async getFreeDaysAll () {
    const linksToCalendars = await this.#getLinks()
    const freeDaysPaulPromise = this.#getFreeDays(linksToCalendars.paul)
    const freeDaysPeterPromise = this.#getFreeDays(linksToCalendars.peter)
    const freeDaysMaryPromise = this.#getFreeDays(linksToCalendars.mary)

    const freeDays = await Promise.all([freeDaysPaulPromise, freeDaysPeterPromise, freeDaysMaryPromise])

    return this.#filterFreeDays(freeDays)
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
   * @returns {string[]} An array with the free days.
   */
  async #getFreeDays (url) {
    const allDays = await this.#webScraper.scrapeText(url, 'td')
    const allDaysLowerCase = allDays.map(text => text.toLowerCase())

    const freeDays = []
    for (let i = 0; i < allDaysLowerCase.length; i++) {
      let day
      switch (i) {
        case 0:
          day = 'Friday'
          break
        case 1:
          day = 'Saturday'
          break
        case 2:
          day = 'Sunday'
          break
      }

      if (allDaysLowerCase[i].includes('ok')) {
        freeDays.push(day)
      }
    }

    return freeDays
  }

  #filterFreeDays (freeDays) {
    let fridayCount = 0
    let saturdayCount = 0
    let sundayCount = 0
    freeDays.flat().forEach(day => {
      if (day === 'Friday') {
        fridayCount++
      } else if (day === 'Saturday') {
        saturdayCount++
      } else if (day === 'Sunday') {
        sundayCount++
      }
    })

    const freeDaysAll = []
    if (fridayCount === 3) {
      freeDaysAll.push('Friday')
    }
    if (saturdayCount === 3) {
      freeDaysAll.push('Saturday')
    }
    if (sundayCount === 3) {
      freeDaysAll.push('Sunday')
    }

    return freeDaysAll
  }
}
