import { sql, db } from '@vercel/postgres';
import { cookies } from 'next/headers';
const bcrypt = require('bcrypt');
const moment = require('moment');

var getUserSession = async (email) => {
    let client = await db.connect();
  try {
    
    const currUser = await client.sql`SELECT Id FROM users WHERE email = ${email}`;
    //console.log('validate user',currUser);
    if(currUser?.rows==null || currUser.rows.length==0) return null;
    const currUserSession = await client.sql`SELECT * FROM usersessions WHERE user_id = ${currUser.rows[0].id} ORDER BY createdDate DESC`;
    //console.log('validate user',currUserSession);
    if(currUserSession?.rows==null || currUserSession.rows.length == 0) return null;
    return currUserSession.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch session data.');
  } finally{
    await client.end();
  }
}
var isUserSessionValid = async (email, sessionKey) => {
    try {
     const userSession = await getUserSession(email);
     if(!userSession)return false;
     let currDateTime = moment().utc();
     let validationExpiryTime = moment(userSession.validationend,'YYYY-MM-DD HH:MM:SS').utc(true);
     if(currDateTime.isBefore(validationExpiryTime )){
        return await bcrypt.compare(userSession.sessionid, sessionKey);
     }
     return false;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to validate session data.');
    }
  }

var generateSession = async (client, sessionUser) =>{
  //console.log('generateSession');
  var isClientCreated = false;
  try{
      var sessionRef = sessionUser.id+ (Math.random())*25100;
      var sessionId = await bcrypt.hash(sessionRef.toString(), 10);
      if(!client) {
          client = await db.connect();
          isClientCreated = true;
      }
      const userSessions = await getSession(client, sessionUser.id);
      if(userSessions && userSessions.rows && userSessions.rowCount>0){
          var sessionIds = [];
          userSessions.rows.map(session=>{sessionIds.push(session.id)});
          const deletedSessions  = await deleteOlderSessions(client, sessionIds);
      }
      const validationEnd = moment().add(90,'m').utc().format('YYYY-MM-DD HH:MM:SS');
      const insertedSession = await client.sql `
          INSERT INTO usersessions (sessionid, user_id, createdDate, validationEnd)
          VALUES (${sessionId}, ${sessionUser.id}, ${new Date()},${validationEnd})
          ON CONFLICT (id) DO NOTHING;`;
      if(insertedSession.rowCount==0) throw Error('Session creation failed');
      const newUserSessions = await getSession(client, sessionUser.id);
      if(!newUserSessions || !newUserSessions.rows || newUserSessions.rowCount==0) throw Error('Session creation failed');
      if(isClientCreated) await client.end();
      return {
          newSession : newUserSessions.rows[0]
      }

  }catch(error){
      //console.log(error);
      throw error;
  }
}

var getSession = async (client, userId) =>{
  var isClientCreated = false;
  try{
      if(!client) {
          client = await db.connect();
          isClientCreated = true;
      }
      //console.log(userId);
      const userSessions = await client.sql`SELECT * FROM usersessions WHERE user_id = ${userId} ORDER BY createdDate DESC`;
      //console.log(userSessions);
      if(isClientCreated) await client.end();
      return userSessions;
  }catch(err){
      //console.log(err);
      if(isClientCreated) await client.end();
      throw err;
  }
}
var deleteOlderSessions = async(client, sessionIds)=>{
  var isClientCreated = false;
  try{
      if(!client) {
          client = await db.connect();
          isClientCreated = true;
      }
      //console.log(sessionIds);
      var sessionsToDelete = '(\''+sessionIds.join('\',\'')+'\')';
      //console.log(sessionsToDelete);
      const deletedUserSessions = await client.query(`DELETE FROM usersessions WHERE id IN ${sessionsToDelete}`);
      //console.log(deletedUserSessions);
      if(isClientCreated) await client.end();
      return {
          deletedUserSessions: deletedUserSessions
      }
  }catch(err){
      //console.log(err);
      if(isClientCreated) await client.end();
      throw err;
  }
}

export {getUserSession, generateSession, getSession, deleteOlderSessions, isUserSessionValid}