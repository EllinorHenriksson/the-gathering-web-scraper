/**
 * The cinema module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import fetch from 'node-fetch'

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
   * Creates an instance of Cinema.
   *
   * @param {string} url - The URL of the cinema page.
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

  /**
   * Gets the movies (title and show times) for a certain day.
   *
   * @param {string} day - The day to look for movies.
   * @returns {object} - An object with the movies and their show times.
   */
  async getMovies (day) {
    const dayNumber = this.#convertDayToNumber(day)

    const showsMovie1Promise = this.#getShowsForMovie('01', dayNumber)
    const showsMovie2Promise = this.#getShowsForMovie('02', dayNumber)
    const showsMovie3Promise = this.#getShowsForMovie('03', dayNumber)

    const showsAllMovies = await Promise.all([showsMovie1Promise, showsMovie2Promise, showsMovie3Promise])

    return [
      {
        movie: 'The Flying Deuces',
        shows: [...showsAllMovies[0]]
      },
      {
        movie: 'Keep Your Seats, Please',
        shows: [...showsAllMovies[1]]
      },
      {
        movie: 'A Day at the Races',
        shows: [...showsAllMovies[2]]
      }
    ]
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
    const response = await fetch(`${this.#url}check?day=${dayNumber}&movie=${movieNumber}`)
    const body = await response.json()
    const shows = []

    for (let i = 0; i < body.length; i++) {
      if (body[i].status === 1) {
        shows.push(body[i].time)
      }
    }

    return shows
  }
}
