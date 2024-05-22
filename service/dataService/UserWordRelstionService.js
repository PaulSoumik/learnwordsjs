import { sql, db } from '@vercel/postgres';
import { cache } from 'react'
import { dbConnect } from './dbConnect';


const statusMap = {
    'Notes' : 'notes',
    'New' : 'new',
    'In Review' : 'inreview',
    'Recheck' : 'recheck',
    'Completed' : 'completed'
}
var createUserWordRelation = async (client, userWordRel) => {
    var res = {
        success: false,
        data: null,
        error: null
      };
    var isClientCreated = false;
    try {
        console.log('create relation');
        if(!client) {
            client = await dbConnect();
            isClientCreated = true;
        }
        
        userWordRel.status = !userWordRel.status ? 'new' : statusMap[userWordRel.status];

        if(userWordRel.userId==null || userWordRel.wordId==null){
            throw Error('Record can\'t be created without word_id or user_id');
        }
        if(userWordRel.status!='notes'){
            const userWordRelations = await client.sql`
                SELECT * FROM userwordrelations 
                WHERE user_id = ${userWordRel.userId} AND word_id = ${userWordRel.wordId} AND status != 'notes'
                ORDER BY createdDate DESC`;
            if(userWordRelations.rowsCount>0 && userWordRelations.rows.length>0){
                res.data = userWordRelations.rows[0];
                throw Error('Data already exists');
            }
            if(userWordRelations.rowsCount>0){
                throw Error('Data already exists but not found');
            }
        }
        const insertedUserWordRelation = await client.sql `
            INSERT INTO userwordrelations (word_id, user_id, status, notes, createdDate)
            VALUES (${userWordRel.wordId}, ${userWordRel.userId},${userWordRel.status},${userWordRel.notes}, ${new Date()})
            ON CONFLICT (id) DO NOTHING;`;
        if(insertedUserWordRelation.rowsCount==0) throw Error('data creation failed');
        res.success =  true;
        res.data = insertedUserWordRelation.rows;
    } catch (error) {
        console.error('Database Error:', error);
        res.success =  false;
        res.error = error;
    } finally{
        if(isClientCreated) await client.end();
    }
    return res;
}
var updateUserWordRelation = async (client,userWordRel) => {
    console.log('update rel');
    var res = {
        success: false,
        data: null,
        error: null
      };
    var isClientCreated = false;
    try {
        if(!client) {
            client = await db.connect();
            isClientCreated = true;
        }
        //if(userWordRel.id==NULL) throw Error('Missing required field id for update');
        console.log('statusu',userWordRel.status);
        userWordRel.status = userWordRel.status && statusMap[userWordRel.status]!=null ? statusMap[userWordRel.status] : 'new' ;
        if(!userWordRel.id){
            throw Error('Record can\'t be updated without id');
        }
        var statusesToCheck = userWordRel.status == 'notes'? ['notes'] : ['new','inreview','recheck','completed'];
        if(userWordRel.status!='notes'){
            userWordRel.notes = null;
        }
        //throw Error();
        const updatedUserWordRelation = await client.sql`
            UPDATE userwordrelations SET 
            (status, notes) = (${userWordRel.status},${userWordRel.notes})
            WHERE id = ${userWordRel.id};`;
            //word_id = ${userWordRel.wordId} AND user_id = ${userWordRel.userId} AND status in ${statusesToCheck};`;
        res.success =true;
        res.data = updatedUserWordRelation.rows;
    } catch (error) {
      console.error(error);
      res.success = false;
      res.error = error;
    } finally{
        if(isClientCreated) await client.end();
    }
    return res;
  }

var fetchUserWordRelation = async (client, words, users) =>{
    var res = {
        success: false,
        data: null,
        error: null
      };
    var isClientCreated = false;
    try{
        if(!client) {
            client = await dbConnect();
            isClientCreated = true;
        }
        //console.log(words);
        console.log('fetch rel');
        if(!words || !users || words.length == 0 || users.length == 0){
            throw Error('User and words are required to fetch relation');
        }
        var wordIds=[];
        var wordsToCheck = '(';
        words.map(item=>{
            if(item?.id==null) return;
            wordIds.push(item.id);
            wordsToCheck+=`'${item.id}',`;
        })
        wordsToCheck = wordsToCheck.slice(0,-1)+')';
        var userIds=[];
        var usersToCheck = '(';
        users.map(item=>{
            if(item?.id==null) return;
            userIds.push(item.id);
            usersToCheck+=`'${item.id}',`;
        })
        usersToCheck = usersToCheck.slice(0,-1)+')';
        console.log('fetch rel Ids', userIds, wordIds);

        //var statusesToCheck = userWordRel.status == 'notes'? ['notes'] : ['new','inreview','recheck','completed'];
        const query = `SELECT * FROM userwordrelations WHERE user_id IN ${usersToCheck} AND word_id IN ${wordsToCheck} ORDER BY createdDate DESC`;
        const userWordRelationsData = await client.query(query);
        console.log(userWordRelationsData);
        res.data = userWordRelationsData.rows;
        res.success = true;

    } catch(error){
        console.log(error);
        res.success = false;
        res.error = error;
    } finally{
        if(isClientCreated) await client.end();
    }
    //console.log(res);
    return res;
};

var deleteUserWordRelation = async (client, userWordRel) =>{
  var isClientCreated = false;
  var res = {
    success: false,
    data: null,
    error: null
  };
  try{
      if(!client) {
          client = await db.connect();
          isClientCreated = true;
      }
      const deletedUserWordRelaton = await client.sql`DELETE FROM userwordrelations WHERE id = ${userWordRel.id}`;
      //console.log(deletedUserWordRelaton);
      res.data = deletedUserWordRelaton.rows;
      res.success = true;
  }catch(err){
      //console.log(err);
      res.success = false;
      res.error = err;
  }finally{
    if(isClientCreated) await client.end();
  }
  return res;
}

export {fetchUserWordRelation, createUserWordRelation, deleteUserWordRelation, updateUserWordRelation}
