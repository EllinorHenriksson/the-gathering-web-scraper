/**
 * The starting point of the application.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import { Application } from './application.js'

function main () {
    try {
        const url = process.argv[2]
        const app = new Application(url)
        await app.run()
        // Done with run()
    } catch (error) {
        console.error(error.message)
    }
}

main()