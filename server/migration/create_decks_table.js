import pkg from 'pg';
const { Pool } = pkg;

// Replace with your actual database connection details
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Heroku Postgres SSL
  }
});

async function createDecksTable() {
  const client = await pool.connect();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS decks (
        id SERIAL PRIMARY KEY,
        legendaries TEXT[],
        artifacts TEXT[],
        creatures TEXT[],
        enchantments TEXT[],
        instants TEXT[],
        sorceries TEXT[],
        lands_basic TEXT[],
        lands TEXT[],
        legal BOOLEAN,
        commander_card JSONB NOT NULL,
        user_owner INTEGER REFERENCES users(id) NOT NULL,
        deck_title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(query);
    console.log('Decks table created successfully!');
  } catch (error) {
    console.error('Error creating decks table:', error);
  } finally {
    client.release();
    await pool.end(); // Close the pool when done
  }
}

createDecksTable();