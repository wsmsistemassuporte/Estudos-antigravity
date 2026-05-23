import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.on('error', (err, client) => {
  console.error('Erro inesperado no banco de dados', err);
});

// Cria as tabelas se elas não existirem no Postgres
const initDb = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        topic VARCHAR(255) NOT NULL,
        time_available VARCHAR(255) NOT NULL,
        plan_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Tabelas verificadas/criadas no PostgreSQL.');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
};

initDb();

export default db;
