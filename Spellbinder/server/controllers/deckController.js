// controllers/deckController.js
import { getAllDecks, getDeckById, createDeck, updateDeck, deleteDeck } from '../models/deckModel.js';
  
  export const fetchAllDecks = async (req, res) => {
    const decks = await getAllDecks();
    res.json(decks);
  };
  // and so on for other controller functions...
  
  //setting deck legality after any push or post.