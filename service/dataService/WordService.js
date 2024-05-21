import { sql } from '@vercel/postgres';
import { cache } from 'react'
import { dbConnect } from './dbConnect';

const activeStatus = ['new', 'inactive', 'active'];
const fetchWords = cache(async ()=>{
  //console.log('Entring fetch Words');
  try {
    const data = await sql`SELECT * FROM words`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch words data.');
  }
});
const updateWords = async (client, words)=>{
  var success = false;
  var errors = null;
  var data  = null;
  var clientInitiated = false;
  try {
    if(!client) {
      client = await dbConnect();
      clientInitiated = true;
    }
    var wordIds = [];
    words.map(item=>{
      if(!item.id){
        return;
      }
      wordIds.push(item.id);
    });
    const storedWords =  await client.sql`SELECT * FROM words WHERE id in ${wordIds}`;
    var existingWordsMap ={};
    storedWords.map(word=>{
      existingWordsMap[word.id] = word;
    })
    var preparedWordsToUpdate;
    words.map(item=>{
      if(!item.id) return;
      if(!existingWordsMap[item.id]) return;
      if(!item.status || !activeStatus.includes(item.status)){
        item.status = existingWordsMap[item.id].status;
      }
      item.word = !item.word ? existingWordsMap[item.id].word : item.word;
      item.definition = !item.definition ? existingWordsMap[item.id].definition : item.definition;
      item.wordtype = !item.wordtype ? existingWordsMap[item.id].wordtype : item.wordtype;
      preparedWordsToUpdate += '('+item.id+', '+item.word +', '+item.definition+', '+item.status+', '+item.wordtype+'),';
    });
    preparedWordsToUpdate = preparedWordsToUpdate.slice(0,-1);
    const updatedWords = await client.sql `
      UPDATE words as w SET 
        word = c.word,
        definition = c.definition,
        status = c.status,
        wordtype = c.wordtype
      FROM (VALUES ${preparedWordsToUpdate} as c (word, definition, status, wordtype)
      WHERE w.id = c.id RETURNING id;`;
    if(updatedWords.rowCount==0) throw Error('Words creation failed');
    success = true;
    data = updatedWords.rows;
  } catch (error) {
    console.error('Database Error:', error);
    success = false;
    errors = 'Database Error:', error;
    
  }finally{
    if(clientInitiated) client.end();
  }
  return {
    success: success,
    words: data,
    err: errors
  }
};
const createWords = async (client, words)=>{
  var success = false;
  var errors = null;
  var data  = null;
  var clientInitiated = false;
  try {
    if(!client) {
      client = await dbConnect();
      clientInitiated = true;
    }
    var preparedWordsToInsert;
    words.map(item=>{
      if(!item.word || !item.definition){
        return;
      }
      if(!activeStatus.includes(item.status)){
        item.status = activeStatus[0];
      }
      item.wordtype = !item.wordtype? '' : item.wordtype;
      preparedWordsToInsert += '('+item.word +', '+item.definition+', '+item.status+', '+item.wordtype+'),';
    });
    preparedWordsToInsert = preparedWordsToInsert.slice(0,-1);
    const insertedWords = await client.sql `
      INSERT INTO words (word, definition, status, wordtype)
      VALUES ${preparedWordsToInsert}
      ON CONFLICT (id) DO NOTHING RETURNING id;`;
    if(insertedWords.rowCount==0) throw Error('Words creation failed');
    success = true;
    data = insertedWords.rows;
  } catch (error) {
    console.error('Database Error:', error);
    success = false;
    errors = 'Database Error:', error;
    
  }finally{
    if(clientInitiated) client.end();
  }
  return {
    success: success,
    words: data,
    err: errors
  }
};

export {fetchWords, updateWords, createWords};
