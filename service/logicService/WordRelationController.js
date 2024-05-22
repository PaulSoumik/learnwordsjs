
import { fetchWords } from "../dataService/WordService";
import { fetchSynonyms } from "../dataService/SynonymsService";
import { fetchSentences } from "../dataService/SentencesService";
import { cache } from 'react'
import { createUserWordRelation, fetchUserWordRelation, updateUserWordRelation } from "../dataService/UserWordRelstionService";
import { getUser } from "../dataService/UserServices";
import { dbConnect, serverlog, serverlog2 } from "../dataService/dbConnect";

//word format
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
const prepareWordData = cache((words, synonyms, sentences, userWordRelations)=>{
  let wordData = new Map();
  //preparing the word data for each words
  words.map((word,index)=>{
    wordData.set(word.id, {
      word: word.word,
      id: word.id,
      definition: word.definition,
      wordtype: word.wordtype,
      slideIndex: index,
      synonyms: [],
      sentences: [],
      userStatus:{},
      userNotes: []
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


  //Adding notes and word status
  userWordRelations?.map(usersRel=>{
    if(usersRel.status=='notes' && wordData.get(usersRel.word_id)){
      wordData.get(usersRel.word_id).push({id: usersRel.id, notes: usersRel.notes, status: usersRel.status, word: wordData.get(usersRel.word_id).word})
    }
    if(usersRel.status!='notes' && wordData.get(usersRel.word_id) && wordData.get(usersRel.word_id).userStatus==''){
      wordData.get(usersRel.word_id).userStatus== {
        id : usersRel.id,
        status: usersRel.status
      };
    }
  });
  //console.log(wordData);
  return wordData;
});


const getWordsUserDataAll = async ()=>{
    return getWordsUserData(null);
}

const getWordsUserData = async (isValidLoggedIn, userEmail) => { 
    const words = await fetchWords();
    const synonyms = await fetchSynonyms();
    const sentences = await fetchSentences();
    //console.log(userEmail);
    var client = await dbConnect();
    const user = userEmail? await  getUser(client, userEmail) : null;
    var userArr = [];
    if(user){
      userArr.push(user);
    }
    console.log(userArr);
    const userWordRelations = await fetchUserWordRelation(client,words,userArr);
    if(!isValidLoggedIn){
        words.slice(0,3);
    }
    return prepareWordData(words, synonyms, sentences, userWordRelations.data);
}


const updateWordStatus = async (userRelId, wordId, userEmail, status)=>{
  if(status==null) return;
    let noError = false;
    let result = {
        success: false,
        data: null,
        error: null
    };
    var res = {
        success: false,
        data: null,
        error: null
    };
    var client;
    try{
        console.log('update status');
        console.log(userEmail);
        client = await dbConnect();
        let userRelrec;
        if(userRelId==null && userEmail==null) throw Error('Not enough data');
        
        if(userRelId==null){
            const user = await getUser(client, userEmail);
            if(user==null) throw Error('User not found');
            console.log(user);
            userRelrec = {
                wordId : wordId,
                userId : user.id,
                status: status,
                notes: null 
            }
            console.log('before create', userRelrec);
            result = await createUserWordRelation(client, userRelrec);
            console.log('after create');
            if(result.success == false && result.data!=null){
                userRelId = result.data.id;
            }
            res.success = result.success;
            res.data= result.data;
            res.error= result.error;
        }
        if(userRelId!=null){
            userRelrec = {
                id : userRelId,
                status: status,
                notes: null 
            }
            result = await updateUserWordRelation(client,userRelrec);
            noError = result.success;
            res.success = result.success;
            res.data= result.data;
            res.error= result.error;
        }
    }catch(error){
        console.log(error)
        noError = false;
        res.error= result.error;
    } finally{
        await client.end();
    }
    return res;
}

export {getWordsUserData, getWordsUserDataAll, updateWordStatus};