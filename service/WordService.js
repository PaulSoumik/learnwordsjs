import { sql } from '@vercel/postgres';
import { cache } from 'react'

const fetchWords = cache(async ()=>{
  console.log('Entring fetch Words');
  try {
    const data = await sql`SELECT * FROM words`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch words data.');
  }
});

export {fetchWords};
// export async function fetchWords() {
//   try {
//     const data = await sql`SELECT * FROM words`;
//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch words data.');
//   }
// }
