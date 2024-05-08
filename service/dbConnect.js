import { sql } from '@vercel/postgres';

const { db } = require('@vercel/postgres');
var client = null;
export async function dbConnect(){
    if(client==null)  client= await db.connect();
    return client; 
}



/*const words = await fetchWords();
  const synonyms = await fetchSynonyms();
  const sentences = await fetchSentences();
  
  let wordData = [];//prepareWordData(words, synonyms, sentences);
    {
    id: {
        word:'',
        definition:'',
        wordtype:'',
        slideIndex:'',
        Synonyms : [],
        Sentences: []
    }
  }
  words.map((word,index)=>{
    wordData[word.id] = {
      word: word.word,
      definition: word.definition,
      wordtype: word.wordtype,
      slideIndex: index,
      synonyms: [],
      sentences: []
    }
  });

  //Adding sysnonyms to each word if present
  let synonymCheck = {};
  synonyms.map(syn=>{
    if(!syn.synonymto_id || !syn.synword_id) return;
    if(synonymCheck[syn.synonymto_id+'_'+syn.synword_id] || synonymCheck[syn.synword_id+'_'+syn.synonymto_id]){
      return;
    }
    synonymCheck[syn.synonymto_id+'_'+syn.synword_id] = true;
    wordData[syn.synonymto_id].synonyms.push({id:syn.synword_id, word: wordData[syn.synword_id].word});
    wordData[syn.synword_id].synonyms.push({id:syn.synonymto_id, word: wordData[syn.synonymto_id].word});
  });

  //Adding sentences for each word
  let sentenceCheck = {};
  sentences.map(stnc=>{
    if(sentenceCheck[stnc.id+'_'+stnc.word_id]){
      return;
    }
    synonymCheck[stnc.id+'_'+stnc.word_id] = true;
    wordData[stnc.word_id].sentences.push({id: stnc.id, sentence: stnc.sentence, wordId: stnc.word_id, word: wordData[stnc.word_id].word});
  });
  console.log('Data');
  
  console.log(wordData);*/