import { sql } from '@vercel/postgres';

export async function fetchSynonyms() {
  try {
    const data = await sql`SELECT * FROM synonyms`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch words data.');
  }
}