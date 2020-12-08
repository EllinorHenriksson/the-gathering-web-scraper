# Assignment A2 - The Gathering Web Scraper

In this assignment, you got to help three friends, Peter, Paul, and Mary, with planning their once a month gathering. Once a month, they gather to watch a movie and then dine at their favorite restaurant. It is quite difficult for the friends to plan a gathering because they first have to find at least one day when everyone can then find a movie, to finally find a time when a table is free to book at the restaurant.

The friends have their calendars available online on a website, and the cinema and restaurant they visit also have websites. The friends realize that the planning of an evening should be able to be automated but do not know how to do it. What they do know is that they definitely do not need a GUI and want to run the application from a command prompt, and that Peter prefers Windows, Paul prefers macOS and Mary prefers Linux (#1).

Your task is to help the three friends by writing a web scraper that scrapes and analyzes data from the mentioned websites (explicitly built for this task). The application should be so generally written that it can handle two different start URLs, https://cscloud6-127.lnu.se/scraper-site-1 and https://cscloud6-127.lnu.se/scraper-site-2. (#3)

When starting the application, the start URL must be passed as an argument. The URLs are each leading to three other websites. It is irrelevant how these websites work under the hood. The interesting part is the HTML rendered and how to make HTTP requests to retrieve data. It does not matter which URL the application starts with because the websites are nearly the same, and only the data scraped differs, and thus the suggestions the application finally lists.

## The websites

From the start URL, the application must be able to crawl all three websites on its own. Data must be scraped, analyzed, and suggestions for day, movie, and time to book a table must be listed. (#4)

Regardless of the start URL, the HTML of each website is nearly the same. The differences exist to ensure that your scraping code is as general as possible and as little as possible has been hard-coded. The minor differences that exist are:

- href attribute values in HTML.
- Days when the three friends are available.
- Movie titles, when they start, and if there are any places left.
- Which tables the friends can book, and the redirect URL when logging in.

The varying `href` attribute values are to verify your scraping code does not use hard-coded URLs. URLs defined in JavaScript, as in the AJAX and cinema example, will not change. You can, in other words, hard-code these.

### The start URL

The application must start by scraping the links on the web page given by the start URL and continue from there.

### The calendar

The web pages are built using simple HTML, and the task is to scrape the pages and analyze which days all three friends can gather. The friends have already decided that they will meet on Fridays, Saturdays, and Sundays, so there is no need to look for any other days (#5).

### The cinema

The cinema website is a simple website that displays the cinema's shows for the weekend. You can find out what day and time a particular movie is shown and if it is sold out. By analyzing the traffic between the client and the server, you should find a way to request this information in your application and filter out suitable movies based on scraped data from the calendars.

#### Hint

Use the browser's inspector to analyze the traffic.

### The restaurant

The third website is for the three friends' favorite restaurant (the only one they visit). The application must log in, by the login credentials below, to scrape what times they can book a table.

<table>
  <tr>
    <td>username</td>
    <td>zeke</td>
  </tr>
  <tr>
    <td>password</td>
    <td>coys</td>
  </tr>
</table>

The website uses session cookies for authorization, which the application must handle in some way. After a successful login, the scraper can find available times.

## The workflow to automate

1. Check which day, or days, all friends are available. If it is impossible to find a day when everyone can, this must be presented in the terminal window.
2. Scrape available movies for the possible days.
3. Log in to the restaurant's website to determine when the three friends can dine. Suppose they want to book a table at least two hours after the movie starts (#6).
4. By analyzing the scraped data, it remains to put together proposals containing the day, the movie with start time, and between which times to book a table.

### Optional

- Pre-book a table using the restaurant's form. (#8)

## Requirements

You must use the repository created for you and this assignment and make continuous commits, so it is possible to follow the web scraper's creation. Make sure that no more files than necessary are committed to the repository. (#9)

You must write the web scraper as a Node.js application (#1) and follow the course's coding standard (#10). You must split your source code into several modules (#12). Of course, you need to document and comment on the source code (#11).

After cloning the repository with the application's source code and running `npm install`, it must be easy to lint the source code and run the application. Therefore, be sure to add the script `start` and `lint` to the "scripts" field in the `package.json` file. (#14)

When running the web scraper, the user must pass the start URL as an argument (#2, #3). That is the only input the user should do during the scrape process (#2). Below is an example of how to start the scraper, using https://cscloud6-127.lnu.se/scraper-site-1 as the start URL:

```shell
npm start https://cscloud6-127.lnu.se/scraper-site-1
```

You are free to use whichever userland module you want (except if there is one out there with the complete solution). Do not forget to ensure, as far as possible, that the module is safe to use. (#13)

The web scraper must present the suggestions in a terminal window according to the details below (#7).

## The output

### Using the first start URL

If https://cscloud6-127.lnu.se/scraper-site-1 is used as the start URL, the list of suggestions must be exact:

```shell
Scraping links...OK
Scraping available days...OK
Scraping showtimes...OK
Scraping possible reservations...OK

Suggestions
===========
* On Friday, "Keep Your Seats, Please" begins at 16:00, and there is a free table to book between 18:00-20:00.
* On Friday, "A Day at the Races" begins at 16:00, and there is a free table to book between 18:00-20:00.
```

The result should not be more verbose than this. Be sure to delete all other statements printing to the terminal before submitting. The suggestions above are the correct ones for the first start URL, and you can use it to verify the output from your scraper.

### Using the second start URL

For the second URL, https://cscloud6-127.lnu.se/scraper-site-2, some of the data and URLs have changed. Your web scraper must be able to produce the correct suggestions for this start URL as well. The list of suggestions from the scraper must be exact:

```shell
Scraping links...OK
Scraping available days...OK
Scraping showtimes...OK
Scraping possible reservations...OK

Suggestions
===========
* On Saturday, "Keep Your Seats, Please" begins at 18:00, and there is a free table to book between 20:00-22:00.
* On Sunday, "Keep Your Seats, Please" begins at 18:00, and there is a free table to book between 20:00-22:00.
```

## Hints

Make sure to do the "Promising Web Scraper" exercise.
