import { sql } from '@vercel/postgres';

export async function fetchSentences(client) {
  var isClientCreated = false;
  if(client==null || !client.readyForQuery){
    client = await dbConnect();
    isClientCreated= true;
  }
  try {
    const data = await client.sql`SELECT * FROM sentences`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch words data.');
  } finally{
    if(isClientCreated) await client.end();
  }
}