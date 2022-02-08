/**
 * The application module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import { StartPage } from './start-page.js'
import { Calendar } from './calendar.js'
import { Cinema } from './cinema.js'
import { Dinner } from './dinner.js'
import validator from 'validator'

/**
 * Represents a Node application.
 */
export class Application {
  /**
   * The URL to scrape.
   *
   * @param {string} url
   */
  #url

  /**
   * Creates an instance of the class Application.
   *
   * @param {string} url - The URL to scrape.
   */
  constructor (url) {
    this.#url = url
  }

  /**
   * Returns the value for the this.#url string.
   *
   * @returns {string} The this.#url string.
   */
  get url () {
    return this.#url
  }

  /**
   * Validates the URL and sets the value of this.#url to the passed argument.
   *
   */
  set url (url) {
    if (!url) {
      throw new Error('No URL was passed as an argument.')
    } else if (!validator.isURL(url)) {
      throw new Error('The passed argument is not a valid URL.')
    }
  }

  /**
   * Runs the application.
   */
  async run () {
    // Scrape start page for links to calendar, cinema and restaurant.
    const startPage = new StartPage(this.#url)
    process.stdout.write('Scraping links...')
    const links = await startPage.getLinks()
    process.stdout.write('OK\n')

    // Scrape calendar page for links to Paul, Peter and Mary, and scrape their pages for free days.
    const calendar = new Calendar(links.calendar)
    process.stdout.write('Scraping available days...')
    const freeDays = await calendar.getFreeDaysAll()
    process.stdout.write('OK\n')

    // Start two asyncronus tasks (check movies, check free tables - for the day(s) when all friends can meet).

    // Check movies.
    const cinema = new Cinema(links.cinema)
    process.stdout.write('Scraping showtimes...')
    const moviesPromises = freeDays.map(day => cinema.getMovies(day))
    process.stdout.write('OK\n')

    // Check free tables.
    const dinner = new Dinner(links.dinner)
    process.stdout.write('Scraping possible reservations...')
    const freeTablesPromises = freeDays.map(day => dinner.getFreeTables(day))
    process.stdout.write('OK\n')

    // Resolve moviesPromises and freeTablesPromises.
    const movies = await Promise.all([...moviesPromises])
    const freeTables = await Promise.all([...freeTablesPromises])

    // FORTSÄTT HÄR!!!
    // Jämför freeDays, movies och freeTables
    const suggestions = this.#getSuggestions(freeDays, movies, freeTables)
    this.#printSuggestions(suggestions)
  }

  #getSuggestions (freeDays, movies, freeTables) {
    const suggestions = []
    let day, movieTitle, movieTime, table
    // For every free day.
    for (let i = 0; i < freeDays.length; i++) {
      day = freeDays[i]
      // For every movie that day.
      for (let j = 0; j < movies[i].length; j++) {
        movieTitle = movies[i][j].movie
        // For every available show for that movie that day.
        for (let k = 0; k < movies[i][j].shows.length; k++) {
          movieTime = movies[i][j].shows[k]
          // For every free table that day.
          for (let l = 0; l < freeTables[i].length; l++) {
            table = freeTables[i][l]
            // If the table is free at least 2 hours after the show...
            if (this.#compareTableToShow(table, movieTime)) {
              // ...push a suggestion to the array 'suggestions'.
              suggestions.push({
                day: day,
                movie: {
                  title: movieTitle,
                  time: movieTime
                },
                table: table
              })
            }
          }
        }
      }
    }
    return suggestions
  }

  /**
   * 
   * @param {*} table 
   * @param {*} show 
   * @returns 
   */
  #compareTableToShow (table, show) {
    const tableInt = parseInt(table.slice(0, 2))
    const showInt = parseInt(show.slice(0, 2))

    if (tableInt - showInt >= 2) {
      return true
    } else {
      return false
    }
  }

  #printSuggestions (suggestions) {
    const suggestionsText = this.#turnSuggestionsIntoText(suggestions)
    console.log('Suggestions\n===========')
    suggestionsText.forEach(suggestion => console.log(suggestion))
  }

  #turnSuggestionsIntoText (suggestions) {
    return suggestions.map(suggestion => `* On ${suggestion.day}, "${suggestion.movie.title}" begins at ${suggestion.movie.time}, and there is a free table to book between ${suggestion.table}.`)
  }
}
