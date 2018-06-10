# REDACTED's Rover Replacement

First of all, thank you for the opportunity to interview.  This was a fun project to work on.  I hope you'll be impressed by how much I was able to get done.  My last team did 1 week sprints with TDD and pair-swapping, so I'm pretty good at cranking out an MVP in a short time.

## How to run it

These instructions assume you're on a Mac.  If not, you'll have to install mongodb the appropriate way for your OS.

### Prerequisites

You must have the `mongod` command available for the start scripts to use.  `brew install mongodb` if you don't have it already.

`npm` and `node` are also required.

### Install dependencies

`npm install`

The client and server are bundled together in one start command.  In practice, I'd deploy these (and mongodb) as microservices using CI/CD, but to ease the process for this interview I bundled everything together.

### The first time you run the app (or if you want to rebuild the database):

`npm run clean-start`

This will read from "reviews.csv" and populate the database which is enabled by the forked `mongod` process. Feel free to edit the csv file to get different results.

### On subsequent runs:

`npm run quick-start`

This will skip the loading of the database and just launch everything.

In either case, your browser should automatically open to localhost:3000 to view my prototype.

### To run the tests:

`npm test`

See section on testing approach for more details.


## Design Approach

### Server side: Node.js w/ Express

Full stack Javascript comes natural to me, and remains the quickest/cleanest way to get a prototype up and running in no time.  The event loop is fast enough to handle web applications, and can even be nicely scaled if 12-factor design is used.  It doesn't hurt that great libraries exist for pretty much anything you need to accomplish in a jiffy.

### Data store: Mongodb

The recovered data wasn't normalized.  I attempted to build an ERD for a more conventional relational database, but it quicky became apparent that for the given requirements a document-based store would be a good choice.  

Mongo also provides a nice aggregation layer with grouping and filtering stages that match the requirements.  Any further views we build can take advantage of these features and provide high performance.  And, because I'm using Javascript in the entire stack, the JSON format can be passed everywhere with low complexity.

Finally, indexing and creation of tables happens automatically with mongo, which means you can run the scripts, sit back, relax, and enjoy my beautiful work instead of trying to build tables.

### Front End: React

The power of using Javascript to dynamically build a UI speaks for itself.  I was easily able to make a prototype and even add some nice style to it.

The layout allows a responsive design, where we see many sitters per row in a browser, but only 1 as the window shrinks to mobile size.  The results are paginated at the bottom - React binds to the state of the result array, and automatically builds the pages based on changes to this state.  Everything is sorted by the secret sauce required by the assigned algorithm.

I'm not a front-end expert, but I know enough to be dangerous and work with UI/UX teams to deliver quality.  In a full stack role, I'm confident in my ability to tackle this piece of the stack and continually improve my design skills.

### Functional Programming and Ramda.js

I tried to keep things functional, making the code easy to test because of its pure functions with no side effects.  

Ramda is a library full of utility functions to write code that is functional.  I use it here to manipulate objects and arrays in one-line statements that are easy to read.

Also check out the generator function in database.js that creates a database connection, makes a callback, and continues to close the connection when that is completed.  No objects need be exposed, other than a temporary client.  This allowed me to encapsulate all connection management into one block.  I have not tried this approach before for connection management, and I wanted to show the use of a generator, and it seems to work well.  And because node is a single-threaded event loop, nothing should be competing for that connection.

### Testing approach

I used TDD with Mocha - at all times, I have my code, the test file, and the test results in various panes on my screen, so I can track whether any changes I'm making cause failures.  I run early and often, and I write the tests first - though, to be honest, I got a little too excited while working through some issues and had to remember to go back and add tests.  But that's what code coverage reports (and pair programming) are for, right?  I'd definitely add that along with CI/CD in a real work scenario.

In honor of 12-Factor design, to eliminate differences between dev and prod, I think it's important to test against an actual (temporary, test) database here and not use mocking - at least in the data methods themselves.  The aggregation that mongo does is key to the solution and should be tested with real data.

To minimize the complexity you face in running my code, I included startup of the database, teardown, and clearing of test data all within the scripts.  Note that it will take some time for the test to finish, because it calls a mongo shutdown command, and has to wait for the forked process to exit.  In a CI/CD system, I would decouple this to allow for instant test completion.  

If you CTRL-C out of the tests, and want to kill the mongo process manually, run `ps ax | grep mongo`, find the mongod process, and `kill <PID>`.  Otherwise, just wait a few more seconds and it should kill it for you.

## Future improvements

I feel I delivered a great first sprint on this page/app, but the following work remains to be done:

* Split client, server, and database into separate microservices.
* Implement smart caching with expirations.  Have to define the acceptable threshold for eventual consistency. (I wanted to use Redis for this, but didn't get to it within the 1 week timeline.)
* Prefetch the search for only the first N number of pages.  Get more data as needed.
* Allow updates to sitter rating to occur without re-calculating the average from scratch.  Right now, any time the rating is calculated, it's from a mongodb aggregation that groups the visits by sitter name and averages the ratings - then it applies the algorithm to calculate the sitter ranking.  If we add features to delete ratings, re-rate, etc - this solution will still work fine, but in anticipation of higher traffic we might want to explore a way to extrapolate the new rating from the previous one directly.  
* ***I only implemented the features that were explicitly requested*** while leaving room to extend more, which is why there are no functions/tests for deleting or manipulating data.  


## Thank you!

Hope you enjoyed it, and I'd be absolutely overjoyed to get to meet all of you and potentially join the Rover family.  My dogs Calvin and Chloe say "woof" to you.  Translation: REDACTED is awesome and you should totally invite REDACTED on-site!


# Rover Coding Project

Rover.com was destroyed in a terrible Amazon and GitHub accident.
Thankfully, no dogs were harmed, but we have to rebuild our site using data we retrieved from the Google search index.
We'd like to:

- Rebuild our sitter profiles and user accounts.
- Recreate a search ranking algorithm
- Build an appealing search results page

**Please use the languages and frameworks that you feel will best show your skills. Keep in mind that if you are brought for an in-person interview, you will continue building upon this solution. Don't use this project as an opportunity to learn new frameworks or new versions of known frameworks; use what you know best so that you set yourself up for success.**

The work you create here should be representative of code that we'd expect to receive from you if you were hired tomorrow.
Our expectation is that you'll write production quality code including tests.

We encourage you to to add a readme (or update the existing one) to help us understand your approach work and thought process...design choices, trade-offs, dependencies, etc. Please include instructions on how to setup/run your project locally.

Finally, this is not a trick project, so if you have any questions, don't hesitate to ask.

### When you're done with the project...

When you're done with the project, push your work back into the repo.  Then, reply to the email you received from us letting us know you've pushed your project.  You may be tempted to email us directly, but don't do that because we rely on an applicant tracking system (ATS) to keep on top of candidates in process. Replying through it will help ensure you don't slip through the cracks.

## Rebuilding Profiles

We were able to write a script and scrape the Google index for all of the reviews customers have left of sitters.
We have saved that information in the attached CSV.
Using the information in the file, we need to design a database schema and import the data from the .csv file.

**NOTE**: If a stay includes multiple dogs, those names will be included in the same column of the CSV "|" delimited.

## Recreating the Search Ranking Algorithm

- For each sitter, we calculate Overall Sitter Rank.
- Sitter Score is 5 times the fraction of the English alphabet comprised by the distinct letters in what we've recovered of the sitter's name.
- Ratings Score is the average of their stay ratings.
- The Overall Sitter Rank is a weighted average of the Sitter Score and Ratings Score, weighted by the number of stays. When a sitter has no stays, their Overall Sitter Rank is equal to the Sitter Score.  When a sitter has 10 or more stays, their Overall Sitter Rank is equal to the Ratings Score.
- In the event that two or more sitters have the same Overall Sitter Rank, the ordering is unimportant and does not need to be handled.

The Overall Sitter Rank and it's score components must be kept up to date. That means whenever a relevant event happens, that could affect the Overall Sitter Rank, we need to recompute it.

Think about what can make the Overall Sitter Rank change.

## Building a Sitter List

We need to display the sitters on a page in order of their *Overall Sitter Rank*. This should be easy, simply render a list of sitters.

Each row should display one sitter with their name, photo and their *Ratings Score*. We want to display just their *Ratings Score*, but sort by their *Overall Sitter Rank*. Think of the *Ratings Score* as a publicly disclosed concept and sitter attribute, and the *Overall Sitter Rank* as Rover's marketplace "secret sauce" that should remain private.

**NOTE**: Make sure your search sorting and listing can scale well to a large number of records.

## Filtering Sitters

Finally, we need to allow customers to filter out sitters on the page with poor average stay ratings.
Allow users to filter out sitters whose average ratings is below a user specified value.
It’s okay to use UI controls &mdash; sliders, checkboxes, etc &mdash; that limit the values users can enter.

## Hint for Testing the Search Ranking Algorithm
Suppose there is a sitter whose Sitter Score is 2.5 and gets rating of 5.0 with every stay. Then, their score should
behave like:

| Stay          | Overall Sitter Rank         |
| ------------- | ------------- |
| 0 | 2.50
| 1 | 2.75
| 2 | 3.00
| 3 | 3.25
| 4 | 3.50
| 5 | 3.75
| 6 | 4.00
| 7 | 4.25
| 8 | 4.50
| 9 |  4.75
| 10 | 5.00
| 11 | 5.00
| 12 | 5.00
