import path from 'path';
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import authMiddleware from './middleware/authMiddleware.js';
import { fetchCardData } from './api.js';
import pkg from 'pg';
import jwt from 'jsonwebtoken'; // Import the jsonwebtoken library
import dotenv from 'dotenv';

//Utils and models
import { validateDeckLegality } from './utils/deckLegalityUtil.js';

dotenv.config(); // Load environment variables from .env file
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3001;
const saltRounds = 10;

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the Vite build directory
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// Enable CORS for the specific origin of your frontend
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: 'POST, GET, PUT, DELETE', // Include PUT method
    allowedHeaders: 'Content-Type, Authorization', // Make sure to include Authorization header
};

app.use(cors(corsOptions));

console.log(process.env.DATABASE_URL);

// Database connection pool (replace with your actual credentials)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'http://localhost:5173',
    
    //Will be implemented in deployment
    ssl: {
        rejectUnauthorized: false // Required for Heroku Postgres SSL
    }
});

// Helper function to check if a card is within the commander's color identity
function isWithinColorIdentity(cardColors, commanderColors) {
    if (!cardColors || cardColors.length === 0) return true;
    return cardColors.every(color => commanderColors.includes(color));
}

// Helper function to introduce a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to process deck cards and fetch data
async function processDeckCards(commander, cards) {
    const allCards = [commander, ...cards];
    const cardDetails = [];
    const delayBetweenRequests = 150;

    for (const card of allCards) {
        const cardInfo = await fetchCardData(card.id);
        if (!cardInfo) {
            throw new Error(`Could not retrieve data for card with ID ${card.id} named ${card.name} from Scryfall.`);
        }
        cardDetails.push(cardInfo);
        await delay(delayBetweenRequests);
    }
    return cardDetails;
}



// Helper function to categorize deck cards
function categorizeDeckCards(cardDetails) {
    const legendaries = cardDetails?.slice(1).filter(card => card.type_line && card.type_line.startsWith('Legendary')).map(card => card.id) || [];
    const artifacts = cardDetails?.slice(1).filter(card => card.type_line && card.type_line.startsWith('Artifact')).map(card => card.id) || [];
    const creatures = cardDetails?.slice(1).filter(card => card.type_line && card.type_line.startsWith('Creature')).map(card => card.id) || [];
    const enchantments = cardDetails?.slice(1).filter(card => card.type_line && card.type_line.startsWith('Enchantment')).map(card => card.id) || [];
    const instants = cardDetails?.slice(1).filter(card => card.type_line && card.type_line.startsWith('Instant')).map(card => card.id) || [];
    const sorceries = cardDetails?.slice(1).filter(card => card.type_line && card.type_line.startsWith('Sorcery')).map(card => card.id) || [];
    const lands_basic = cardDetails?.slice(1).filter(card => card.type_line && card.type_line.startsWith('Basic Land')).map(card => card.id) || [];
    const lands = cardDetails?.slice(1).filter(card => card.type_line && card.type_line.includes('Land') && !card.type_line.includes('Basic Land')).map(card => card.id) || [];
    return { legendaries, artifacts, creatures, enchantments, instants, sorceries, lands_basic, lands };
}

//User GETs/POSTS
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Check if username or email already exists
        const checkUserQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
        const userCheckResult = await pool.query(checkUserQuery, [username, email]);

        if (userCheckResult.rows.length > 0) {
            return res.status(409).json({ error: 'Username or email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        const insertUserQuery = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email';
        const insertResult = await pool.query(insertUserQuery, [username, hashedPassword, email]);

        if (insertResult.rows.length > 0) {
            const newUser = insertResult.rows[0];
            res.status(201).json({ message: 'User registered successfully!', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
        } else {
            res.status(500).json({ error: 'Failed to register user.' });
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: 'Please provide username/email and password.' });
    }

    try {
        // Check if user exists by username or email
        const checkUserQuery = 'SELECT * FROM users WHERE username = $1 OR email = $1';
        const userResult = await pool.query(checkUserQuery, [usernameOrEmail]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or email.' });
        }

        const user = userResult.rows[0];

        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Authentication successful
            const tokenPayload = {
                id: user.id,
                username: user.username,
                email: user.email,
            };

            // Generate the JWT
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

            // Send the token back to the client
            res.status(200).json({ message: 'Login successful!', user: { id: user.id, username: user.username, email: user.email }, token: token });
        } else {
            res.status(401).json({ error: 'Invalid password.' });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST route to save a new deck
app.post('/api/decks', authMiddleware, async (req, res) => {
    const { name: deck_title, format, commander, cards } = req.body;
    const user_owner = req.user.id; // Get user ID from the authenticated token

    try {
        if (format !== 'Commander') {
            return res.status(400).json({ error: 'Deck format must be Commander.' });
        }

        if (!commander || !commander.id) {
            return res.status(400).json({ error: 'Commander information is missing.' });
        }
        console.log("commander id: " + commander.id)
        const commanderData = await fetchCardData(commander.id);
        console.log("Data: ", commanderData);
        if (!commanderData) {
            return res.status(400).json({ error: 'Could not retrieve commander data from Scryfall.' });
        }

        const cardDetails = await processDeckCards(commander, cards);
        const { legal, legalityReasons } = validateDeckLegality(commanderData, cardDetails);
        const { legendaries, artifacts, creatures, enchantments, instants, sorceries, lands_basic, lands } = categorizeDeckCards(cardDetails);

        const commanderToSave = { id: commander.id, name: commander.name }; // Create a new commander object

        const query = `
            INSERT INTO decks (legendaries, artifacts, creatures, enchantments, instants, sorceries, lands_basic, lands, legal, commander_card, user_owner, deck_title)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id, deck_title, created_at, legal;
        `;

        const result = await pool.query(query, [legendaries, artifacts, creatures, enchantments, instants, sorceries, lands_basic, lands, legal, commanderToSave, user_owner, deck_title]);
        if (result.rows.length > 0) {
            res.status(201).json({ message: 'Deck saved successfully!', deck: result.rows[0], legalityReasons });
        } else {
            res.status(500).json({ error: 'Failed to save deck.' });
        }
    } catch (error) {
        console.error('Error during deck processing:', error);
        res.status(500).json({ error: 'Internal server error during deck processing.' });
    }
});

// GET route to retrieve all decks with owner username and commander ID
app.get('/api/decks/all', async (req, res) => {
    try {
    const query = `
        SELECT
            d.id AS deck_id,
            d.deck_title,
            d.commander_card,
            u.username AS owner_username
        FROM public.decks d
        JOIN public.users u ON d.user_owner = u.id
        ORDER BY d.created_at DESC;
    `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching all decks:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET route to retrieve a specific deck
app.get('/api/decks/:deckId', async (req, res) => {
    const { deckId } = req.params;

    try {
        const query = `
            SELECT id, legendaries, artifacts, creatures, enchantments, instants,
            sorceries, lands_basic, lands, legal, user_owner, deck_title, created_at, commander_card
            FROM decks
             WHERE id = $1
        `;
        const result = await pool.query(query, [deckId]);

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Deck not found.' });
        }
    } catch (error) {
        console.error('Error fetching deck:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// DELETE route to delete a specific deck
app.delete('/api/decks/:deckId', authMiddleware, async (req, res) => {
    const { deckId } = req.params;
    const userId = req.user.id; // Get user ID from the authenticated token

    try {
        // Verify if the deck belongs to the user
        const checkOwnershipQuery = `
            SELECT user_owner
            FROM decks
            WHERE id = $1;
        `;
        const ownershipResult = await pool.query(checkOwnershipQuery, [deckId]);

        if (ownershipResult.rows.length === 0) {
            return res.status(404).json({ error: 'Deck not found.' });
        }

        if (ownershipResult.rows[0].user_owner !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this deck.' });
        }

        // Delete the deck
        const deleteQuery = `
            DELETE FROM decks
            WHERE id = $1;
        `;
        await pool.query(deleteQuery, [deckId]);

        res.status(200).json({ message: 'Deck deleted successfully.' });
    } catch (error) {
        console.error('Error deleting deck:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET route to retrieve all decks for a specific user
app.get('/api/decks/user/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    //only allow a user to fetch their own decks
    if (parseInt(userId) !== currentUserId) {
        return res.status(403).json({ error: 'You are not authorized to view these decks.' });
    }

    try {
        const query = `
                SELECT
                d.id AS deck_id,
                d.deck_title,
                d.commander_card,
                u.username AS owner_username
                FROM decks d
                JOIN users u ON d.user_owner = u.id
                WHERE d.user_owner = $1
                ORDER BY d.created_at DESC;
        `;
        console.log("Executing user decks query:", query); // Add this line
        const result = await pool.query(query, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching user's decks:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// PUT route to update an existing deck
app.put('/api/decks/:deckId', authMiddleware, async (req, res) => {
  const { deckId } = req.params;
  const { name: deck_title, format, commander, cards } = req.body;
  const current_user_id = req.user.id; // Get user ID from the authenticated token

  try {
      const ownershipQuery = 'SELECT user_owner FROM decks WHERE id = $1';
      const ownershipResult = await pool.query(ownershipQuery, [deckId]);

      if (ownershipResult.rows.length === 0) {
          return res.status(404).json({ error: 'Deck not found.' });
      }

      const deckOwnerId = ownershipResult.rows[0].user_owner;
      if (current_user_id !== deckOwnerId) {
          return res.status(403).json({ error: 'You are not authorized to edit this deck.' });
      }

      if (format !== 'Commander') {
          return res.status(400).json({ error: 'Deck format must be Commander.' });
      }

      if (!commander || !commander.id) {
          return res.status(400).json({ error: 'Commander information is missing.' });
      }

      if (!cards || cards.length !== 99) {
          return res.status(400).json({ error: 'Commander deck must contain exactly 100 cards (1 commander + 99 others).' });
      }

      const commanderData = await fetchCardData(commander.id);
      if (!commanderData) {
          return res.status(400).json({ error: 'Could not retrieve commander data from Scryfall.' });
      }

      const cardDetails = await processDeckCards(commander, cards);
      const { legal, legalityReasons } = validateDeckLegality(commanderData, cardDetails);
      const { legendaries, artifacts, creatures, enchantments, instants, sorceries, lands_basic, lands } = categorizeDeckCards(cardDetails);

      const query = `
            UPDATE decks
                SET legendaries = $1,
                artifacts = $2,
                creatures = $3,
                enchantments = $4,
                instants = $5,
                sorceries = $6,
                lands_basic = $7,
                lands = $8,
                legal = $9,
                commander_card = $10,
                deck_title = $11
             WHERE id = $12
            RETURNING id, deck_title, created_at, legal;
        `;

      const result = await pool.query(query, [legendaries, artifacts, creatures, enchantments, instants, sorceries, lands_basic, lands, legal, commander, deck_title, deckId]);

      if (result.rows.length > 0) {
          res.status(200).json({ message: 'Deck updated successfully!', deck: result.rows[0], legalityReasons });
      } else {
          res.status(500).json({ error: 'Failed to update deck.' });
      }

  } catch (error) {
      console.error('Error updating deck:', error);
      res.status(500).json({ error: 'Internal server error during deck update.' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Handle any other requests by serving the index.html file from the build
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});