Spellbinder- a Magic the Gathering Website to create and view decks
Author- Jonathan Lahmann
Last Edits to ReadMe:  4/2/2025
Heroku Host site: https://spellbinder1-95d3c581ba70.herokuapp.com/

Hello! This is my Capstone project for Springboard Fullstack Developer Bootcamp. I am so excited that I learned so much and
created this wonderful app. It may seem little to many seasoned developers, but this process took a month at least and I am so proud of the progress this shows.

The key aspects I wish to show off with this project is an all encompassing understanding of high level compnents of creating a website. I will list the decisions I made and what I would like to improve given more practice.

Javascript-
    I wrote this entire code using Javascript in React-Vite. My choice in coding came down to the fact that Javascript is more flexible when it comes to reacting in real time to user inputs. The main reason being:

    -Autofill Searchbar!

    Thats right, I wanted a working searchbar that predicted user inputs and could handle some simple mispells. it was the first step and focus of part one when creating this project. I felt that Javascript coudl handle this perfectly and lead me into eventually understanding Typescript. give it a try!

API-Scryfall-
    I love Magic the Gathering, its helped me bond with people at work and this API is amazing and free! The app may slow down at times due to the limit of ten requests a second, but thats perfect for now. It helped fill in the grunt work for the autofill, and provide all the details I needed for every card in Magic. Given more practice, I feel i could have included more than just displaying prices of cards on their page, but linked to websites to purchase said cards.

SQL-Postgres-
    This was probably one of the most intensive parts, not just creating the tables, but creating an entire database to manage users and decks along with authentication and removal. the key aspects are found in the database folder. but they include:
    -Bcrypt encryption
    -JSONWebTokens
    -Auhtorization
    -Object saving JSONB

Now for an explanation of each route:
    -APP
        This controls all high level props and routes to all other pages that users can view. I felt it was necassary to have it directly control localstorage for logged in users, so that way the app would not lose track when remounted.

    -Layout
        This included every component that i wanted to always appear at the top of the webpages. It handles the Navigation bar, search bar, and filters. It also hosts the offcanvas card list for users to save cards and add them to a new deck. I am proud of how it turned out, but I could have broken down those parts into middleware given more thorough planning.

    -Carpage
        I wanted to make sure the user got the most important information, and for any card game thats based on legality, different prints for customization, and prices. I planned out this more carefully by implementing a MAgicCard middleware to help display most cards in a readeable fashion. Again, javascript was required to create those reactive onclick elements for those cards that can transform.

    -Cardlist
        This was created after Cardpage and MagicCard, and really makes use of the filters and dropdowns from Layout. You can either use one of the default search options from the navbar, or use the filter for a more refined list. It still implements MagicCards transforming qualities, which I thought was important for users to be able to read the cards without needing to go into CardPage.

    -DeckDisplay
        I made this route before the full decklists and userdecklists. I started with a static user of 1 as I was the only one with access at the time, and eventually built in my user database with authorization so that only the creator could delete their decks. I reused assets from MagicCard to avoid repetitive code, but wanted a different layout than Cardlist. It is important that users know if a deck is legal when viewing it, and that illegal decks will display the reason they are disqualified.
    
    -Sidebar
        The more fun aspect of DeckDisplay was creating an offcanvas sidebar for users to monitor the cards added to their potential deck and remove them before saving. This was integral for beck building as fetching the info for potentially 100 cards would take a while for the api, and I only wanted it done once the user decided they wanted to save the deck permanentley. It was inspired by EDHRec's own sidebar. With some more knowledge and freedom from deadlines, I would like to incorporate the ability to add to a current deck, or export the list of cards to a website allowing users to autopopulate and buy the cards.
    
    -Decklist
        This was an important step to allow a more social aspect. This way a user can see every deck that any other user has built, but can only delete decks that they are the owner of. Included in this idea is that a user's decks are displayed on the homepge for quick navigation to their own creations. Due to time constraints I did not add a favorites option or the ability to like decks, but this is a feature I would like to add in the future.

### Documents to finish
- [x] Initial_project_Ideas.md
- [x] project_proposal.md
- [ ] ReadMe.md refinement 
- [x] Database Schema.md

### Code to implement
- [ ] Fix Error Saving Deck Notifications
- [ ] Allow editing of deck by user/owner
- [ ] Redirect after register or login
- [ ] Validate Passwords for strength and length
- [ ] Implement MVC (Model View Controller) Architecture
- [ ] Tests for code, mostly backend, login, and logout calls