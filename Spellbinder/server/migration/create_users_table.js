import pkg from 'pg';
const { Pool } = pkg;

// Replace with your actual database connection details
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Heroku Postgres SSL
  }
});

async function createUsersTable() {
  const client = await pool.connect();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(query);
    console.log('Users table created successfully!');
  } catch (error) {
    console.error('Error creating users table:', error);
  } finally {
    client.release();
    await pool.end(); // Close the pool when done
  }
}

createUsersTable();