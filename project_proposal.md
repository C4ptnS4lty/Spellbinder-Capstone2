# Project Proposal: Spellbinder
 
## Database Schema: 
- Users
- Decks
- Favorites
- Deck/Users
- Favorites/Users
- combos
- Formats
    (If necessary, creating multiple tables for each format and then making them accessible through a handler).

## API Issues: 
- Massive list of ever expanding cards, making displaying a broad search hard without either sacrificing speed or segmenting the loading into sections.
- Sensitive Information: User login credentials, will use bcrypt to hide sensitive information and jsonwebtokens to identify the backend or frontend requests are not being manipulated.

## Functionality: 

### Events: 
- Decks -> users can create decks by searching a card and hitting a plus sign, which will drop down a menu to add to an inventory of cards. That inventory can then be added to an existing deck, made into a new deck, or adjusted to remove cards first.
- Formats -> Decks will be checked to see which formats, such as standard or EDH, that they are legal in. Users can select a format to see what specifically they need to add or remove for the deck to be legal in the selected format.

### User Flow: 
- Start on Homepage for all that shows a list of cards with the most usage in deck. 
- Signed in users will be greeted with a welcome back, while unlogged users will see a prompt above the card lists to sign up. 
- If a user wants to start adding cards to their floating inventory,invite them to sign up to be able to save. - Navbar will contain: Popular Cards, Popular Decks, Sets, and Signup/Login

### Stretch Goal:
- Graphing mana curve and color composition 
- Making educated suggestions for adding cards based on color composition of deck and common combos with pieces found in the deck, or by subtype such as a large number of enchantment cards.

| ---------- | ------------------------------------------ | ---------------------------------------------------- |
| Intruction |           Description                      |                   Menu                               |
| ---------- | ------------------------------------------ | ---------------------------------------------------- |
| Stack      | Tech stack used for the project.           | React,Node,Express,Javascript,HTML,CSS               |
| ---------- | ------------------------------------------ | ---------------------------------------------------- |
| Focus      | Is the front-end UI or the back-end        | Will be a full-stack application that is primarily   |
|            | going to be the focus of your project?     | focused on Ease of user UI                           |
|            | Or are you going to make an evenly focused | - Back-end will support data management & analysis of|
|            | full-stack application?                    | decks for different formats                          |
|            |                                            | - Front-end will be focused on creating an engaging  |
|            |                                            | intuitive design that will allow users to find cards |
|            |                                            | based on type, color, cost, name, or subtypes        |
| ---------- | ------------------------------------------ | ---------------------------------------------------- |
| Type       | Will this be a website? A mobile app?      | Web application, with bootstrap to help with         |
|            | Something else?                            | mobile phone browsers                                |
| ---------- | ------------------------------------------ | ---------------------------------------------------- |
| Goal       | What goal will your project be designed to | An easy to use platform for MTG card game to manage  |
|            |                                            | manage decks and make sure they can be used in their |
|            |                                            | chosen formats. We will also want to create a        |
|            |                                            | backend analyzer that can quickly access             |
|            |                                            | database info and eventually create easy to          |
|            |                                            | understand graphs for users.                         |
|            |                                            | (mana-curve, color costs, combos)                    |
| ---------- | ------------------------------------------ | ---------------------------------------------------- |
| Users      | What kind of users will visit your app?    | Generally users will at least understand the basic   |
|            | In other words, what is the demographic of | rules of magic the gathering, but not expected to be |
|            | your users?                                | technically savvy and therefore ease of use and      |
|            |                                            | efficiency is important.                             |
| ---------- | ------------------------------------------ | ---------------------------------------------------- |
| Data       | What data do you plan on using? How are you| Data Sources: https://scryfall.com/docs/api          |
|            | planning on collecting your data?          | Data to Collect: Mtg Card data, user decks, favorites|
|            |                                            | Method: API requests and SQL for internal data       |
| ---------- | ------------------------------------------ | ---------------------------------------------------- |