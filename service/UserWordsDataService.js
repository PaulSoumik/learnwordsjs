
import { fetchWords } from "./WordService";
import { fetchSynonyms } from "./SynonymsService";
import { fetchSentences } from "./SentencesService";
import { cache } from 'react'

const prepareWordData = cache((words, synonyms, sentences)=>{
  console.log('prepare data');

  let wordData = new Map();
  /*
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
  */
  //preparing the word data for each words
  words.map((word,index)=>{
    wordData.set(word.id, {
      word: word.word,
      definition: word.definition,
      wordtype: word.wordtype,
      slideIndex: index,
      synonyms: [],
      sentences: []
    });
  });

  //Adding sysnonyms to each word if present
  let synonymCheck = {};
  synonyms.map(syn=>{
    if(!syn.synonymto_id || !syn.synword_id) return;
    if(synonymCheck[syn.synonymto_id+'_'+syn.synword_id] || synonymCheck[syn.synword_id+'_'+syn.synonymto_id]){
      return;
    }
    synonymCheck[syn.synonymto_id+'_'+syn.synword_id] = true;
    wordData.get(syn.synonymto_id).synonyms.push({id:syn.synword_id, word: wordData.get(syn.synword_id).word});
    wordData.get(syn.synword_id).synonyms.push({id:syn.synonymto_id, word: wordData.get(syn.synonymto_id).word});
  });

  //Adding sentences for each word
  let sentenceCheck = {};
  sentences.map(stnc=>{
    if(sentenceCheck[stnc.id+'_'+stnc.word_id]){
      return;
    }
    synonymCheck[stnc.id+'_'+stnc.word_id] = true;
    wordData.get(stnc.word_id).sentences.push({id: stnc.id, sentence: stnc.sentence, wordId: stnc.word_id, word: wordData.get(stnc.word_id).word});
  });
  console.log('Data');
  return wordData;
});
const getWordsUserDataAll = async ()=>{
    return getWordsUserData(null);
}
const getWordsUserData = async (userId) => {
  
  const words = await fetchWords();
  const synonyms = await fetchSynonyms();
  const sentences = await fetchSentences();
  if(!userId) return prepareWordData(words, synonyms, sentences);
  return null;
}

export {getWordsUserData, getWordsUserDataAll};