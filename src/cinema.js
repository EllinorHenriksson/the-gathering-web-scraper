/**
 * The cinema module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import { WebScraper } from './web-scraper.js'

/**
 * Represents the cinema page.
 */
export class Cinema {
  /**
   * The url of the cinema page.
   *
   * @type {string}
   */
  #url

  /**
   * A web scraper.
   *
   * @type {WebScraper}
   */
  #webScraper

  /**
   * Creates an instance of Cinema.
   *
   * @param {string} url - The URL of the cinema page.
   */
  constructor (url) {
    this.#url = url
    this.#webScraper = new WebScraper()
  }

  /**
   * Gets the movies (title and show times) for a certain day.
   *
   * @param {string} day - The day to look for movies.
   * @returns {object} - An object with the movies and their show times.
   */
  async getMovies (day) {
    const movieTitlesPromise = this.#getMovieTitles()

    const dayNumber = this.#convertDayToNumber(day)

    const showsMovie1Promise = this.#getShowsForMovie('01', dayNumber)
    const showsMovie2Promise = this.#getShowsForMovie('02', dayNumber)
    const showsMovie3Promise = this.#getShowsForMovie('03', dayNumber)

    const titlesAndShows = await Promise.all([movieTitlesPromise, showsMovie1Promise, showsMovie2Promise, showsMovie3Promise])

    return [
      {
        movie: titlesAndShows[0]['01'],
        shows: [...titlesAndShows[1]]
      },
      {
        movie: titlesAndShows[0]['02'],
        shows: [...titlesAndShows[2]]
      },
      {
        movie: titlesAndShows[0]['03'],
        shows: [...titlesAndShows[3]]
      }
    ]
  }

  /**
   * Gets the movie title for each movie.
   *
   * @returns {object} An object with movie titles.
   */
  async #getMovieTitles () {
    const title1Promise = this.#webScraper.scrapeText(this.#url, '#movie option[value="01"]')
    const title2Promise = this.#webScraper.scrapeText(this.#url, '#movie option[value="02"]')
    const title3Promise = this.#webScraper.scrapeText(this.#url, '#movie option[value="03"]')

    const allTitles = (await Promise.all([title1Promise, title2Promise, title3Promise])).flat()

    return { '01': allTitles[0], '02': allTitles[1], '03': allTitles[2] }
  }

  /**
   * Converts the name of the day to digits (represented in a string).
   *
   * @param {string} day - The day to convert.
   * @returns {string} The day in digits.
   */
  #convertDayToNumber (day) {
    let dayNumber
    switch (day) {
      case 'Friday':
        dayNumber = '05'
        break
      case 'Saturday':
        dayNumber = '06'
        break
      case 'Sunday':
        dayNumber = '07'
        break
    }
    return dayNumber
  }

  /**
   * Gets the show times for a certain movie, on a certain day.
   *
   * @param {string} movieNumber - The movie to look for shows.
   * @param {string} dayNumber - The day to look for shows.
   * @returns {string[]} The show times for the movie, that day.
   */
  async #getShowsForMovie (movieNumber, dayNumber) {
    const data = await this.#webScraper.scrapeData(`${this.#url}check?day=${dayNumber}&movie=${movieNumber}`)

    const shows = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].status === 1) {
        shows.push(data[i].time)
      }
    }

    return shows
  }
}
