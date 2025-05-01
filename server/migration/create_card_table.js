import pkg from 'pg';
const { Pool } = pkg;

// Replace with your actual database connection details
const pool = new Pool({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost',     // The host where your PostgreSQL server is running (e.g., 'localhost')
  database: 'Spellbinder', // Your database name
  password: 'trainingwheels', // Your PostgreSQL password
  port: 5432,             // Default PostgreSQL port
});

async function createCardTable() {
  const client = await pool.connect();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS decks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        colors TEXT[],
        cmc INTEGER,
        
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

createCardTable();