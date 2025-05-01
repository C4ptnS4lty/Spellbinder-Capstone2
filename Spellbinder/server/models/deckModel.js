// models/deckModel.js
import db from '../db/index.js';

// Get all decks
export const getAllDecks = async () => {
  const result = await db.query('SELECT * FROM decks');
  return result.rows;
};

// Get one deck by ID
export const getDeckById = async (id) => {
  const result = await db.query('SELECT * FROM decks WHERE id = $1', [id]);
  return result.rows[0];
};

// Create a new deck
export const createDeck = async ({
  legendaries = [],
  artifacts = [],
  creatures = [],
  enchantments = [],
  instants = [],
  sorceries = [],
  lands_basic = [],
  lands = [],
  legal = true,
  commander_card,
  user_owner,
  deck_title
}) => {
  const result = await db.query(
    `
    INSERT INTO decks (
      legendaries, artifacts, creatures, enchantments,
      instants, sorceries, lands_basic, lands, legal,
      commander_card, user_owner, deck_title
    )
    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8, $9,
      $10, $11, $12
    )
    RETURNING *;
    `,
    [
      legendaries,
      artifacts,
      creatures,
      enchantments,
      instants,
      sorceries,
      lands_basic,
      lands,
      legal,
      commander_card,
      user_owner,
      deck_title
    ]
  );

  return result.rows[0];
};

// Update an existing deck
export const updateDeck = async (id, {
  legendaries,
  artifacts,
  creatures,
  enchantments,
  instants,
  sorceries,
  lands_basic,
  lands,
  legal,
  commander_card,
  user_owner,
  deck_title
}) => {
  const result = await db.query(
    `
    UPDATE decks SET
      legendaries = $1,
      artifacts = $2,
      creatures = $3,
      enchantments = $4,
      instants = $5,
      sorceries = $6,
      lands_basic = $7,
      lands = $8,
      legal = $9,
      commander_card = $10,
      user_owner = $11,
      deck_title = $12
    WHERE id = $13
    RETURNING *;
    `,
    [
      legendaries,
      artifacts,
      creatures,
      enchantments,
      instants,
      sorceries,
      lands_basic,
      lands,
      legal,
      commander_card,
      user_owner,
      deck_title,
      id
    ]
  );

  return result.rows[0];
};

// Delete a deck
export const deleteDeck = async (id) => {
  await db.query('DELETE FROM decks WHERE id = $1', [id]);
};
