
import { fetchWords } from "../dataService/WordService";
import { fetchSynonyms } from "../dataService/SynonymsService";
import { fetchSentences } from "../dataService/SentencesService";
import { cache } from 'react'
import { createUserWordRelation, deleteUserWordRelation, fetchUserWordRelation, updateUserWordRelation } from "../dataService/UserWordRelstionService";
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
    if(usersRel.status=='notes' && wordData.get(usersRel.word_id)!=null){
      wordData.get(usersRel.word_id).userNotes.push({id: usersRel.id, notes: usersRel.notes, status: usersRel.status, word: wordData.get(usersRel.word_id).word})
    }
    if(usersRel.status!='notes' && wordData.get(usersRel.word_id)!=null){
      console.log(usersRel);
      wordData.get(usersRel.word_id).userStatus = {
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
    var client = await dbConnect();
    const words = await fetchWords(client);
    const synonyms = await fetchSynonyms(client);
    const sentences = await fetchSentences(client);
    
    const user = userEmail? await  getUser(client, userEmail) : null;
    var userArr = [];
    if(user){
      userArr.push(user);
    }
    const userWordRelations = await fetchUserWordRelation(client,words,userArr);
    console.log(userWordRelations);
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
        //console.log(userEmail);
        client = await dbConnect();
        let userRelrec;
        if(userRelId==null && userEmail==null) throw Error('Not enough data');
        
        if(userRelId==null){
            const user = await getUser(client, userEmail);
            if(user==null) throw Error('User not found');
            
            userRelrec = {
                wordId : wordId,
                userId : user.id,
                status: status,
                notes: null 
            }
            //console.log('before create', userRelrec);
            result = await createUserWordRelation(client, userRelrec);
            //console.log('after create');
            if(result.success == false && result.data!=null){
                userRelId = result.data.id;
            }
            //console.log('updateWordStatus after createWordStatus',result);
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
            //console.log('before update', userRelrec);
            result = await updateUserWordRelation(client,userRelrec);
            //console.log('after update', result);
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
Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}
const wordRefMap = {
  'inreview': 'inreview',
  'completed': 'completed',
  'recheck': 'inrecheck',
  'notes': 'notescreated',
  'new': 'umarked',
}
const prepareDashboardData = (wordData, numwords) =>{
  var preparedDashBoardData = {
      inreview: 0,
      completed: 0,
      inrecheck: 0,
      notescreated: 0,
      umarked: 0,
      notedcreatedinlast5days: 0,
      wordscheckedinlast5days:0, 
      totalwords: numwords
  }
  wordData.forEach(word=>{
      preparedDashBoardData[wordRefMap[word.status]]+=1;
      if(word.status=='notes' && new Date().addDays(-5).getTime()>new Date(word.creatddate).getTime()){
          preparedDashBoardData['notedcreatedinlast5days']+=1;
      }
      if(word.status!='notes' && word.status!='new' && new Date().addDays(-5).getTime()>new Date(word.creatddate).getTime()){
          preparedDashBoardData['wordscheckedinlast5days']+=1;
      } 
  })
  preparedDashBoardData['unmarked'] = (numwords-(preparedDashBoardData['inreview']+preparedDashBoardData['completed']+preparedDashBoardData['inrecheck']));
  return preparedDashBoardData;
}
const prepareWordRelationData = async (userEmail) => {
  const client = await dbConnect();
  //console.log(client)
  try{
    //console.log('fetchWords');
    const words = await fetchWords(client);
    //console.log('getUser');
    const user = await getUser(client, userEmail);
    //console.log('wordRelationData');
    const wordRelationData = await fetchUserWordRelation(client, words, [user]);
    var preparedData = prepareDashboardData(wordRelationData.data, words.length)
  }catch(err){
    console.log(err);
  }finally{
    await client.end();
  }
  //console.log(preparedData);
  return preparedData;
}


const addNewNotes = async (wordId, userEmail, note)=>{
  if(note==null) return;
  let result = {
      success: false,
      data: null,
      error: null
  };
  var client;
  try{
      console.log('update status');
      //console.log(userEmail);
      client = await dbConnect();
      const user = await getUser(client, userEmail);
      if(user==null) throw Error('User not found');
          
      let userRelrec = {
          wordId : wordId,
          userId : user.id,
          status: 'Notes',
          notes: note 
      }
      //console.log('before create', userRelrec);
      let res = await createUserWordRelation(client, userRelrec);
      console.log('after create', res);
      if(res.success == false && res.data!=null){
          throw Error('Data creation failed');
      }
      //console.log('updateWordStatus after createWordStatus',result);
      result.success = res.success;
      result.data= res.data;
      result.error= res.error;
  }catch(error){
      console.log(error)
      result.success = false;
      result.error= error;
  } finally{
      if(client!=null) await client.end();
  }
  return result;
}

const deleteUserNotes = async (noteIdToDelete) =>{
  if(noteIdToDelete==null) return;
  let result = {
      success: false,
      data: null,
      error: null
  };
  var client;
  try{
      console.log('update status');
      //console.log(userEmail);
      client = await dbConnect();
      let userWordRel = {
        id: noteIdToDelete
      }
      var res = await deleteUserWordRelation(client,userWordRel);
      result.success = res.success;
      result.data = res.data;
  } catch(err){
    result.error = err;
  }finally{
    if(client!=null) await client.end();
  }
  return result;
}

export {getWordsUserData, getWordsUserDataAll, updateWordStatus, prepareWordRelationData, addNewNotes, deleteUserNotes};