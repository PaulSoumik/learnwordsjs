import { sql } from '@vercel/postgres';
import { dbConnect } from './dbConnect';

export async function fetchSynonyms(client) {
  var isClientCreated = false;
  if(client==null || !client.readyForQuery){
    client = await dbConnect();
    isClientCreated= true;
  }
  try {
    const data = await client.sql`SELECT * FROM synonyms`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch words data.');
  } finally{
    if(isClientCreated) await client.end();
  }
}