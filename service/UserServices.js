import { sql } from '@vercel/postgres';
import { dataTables } from '../models/dataModels';

const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const moment = require('moment');


var saveUser = async (client, user, rollBackMap) =>{
    var isClientCreated = false;
    try{
        console.log(user);
        if(!client) {
            client = await db.connect();
            isClientCreated = true;
        }
        if(!user.email){
            throw Error('Email is reuired to register user');
        }
        console.log(user);
        var userExisting = await getUser(client, user.email);
        console.log(userExisting);
        if(userExisting){
            throw Error('User with the same email already exists');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const insertedUser = await client.sql `
            INSERT INTO users (name, email, password)
            VALUES (${user.name}, ${user.email}, ${hashedPassword})
            ON CONFLICT (id) DO NOTHING;`;
    
        console.log('Added user', insertedUser);
        rollBackMap[dataTables.users] = [];
        insertedUser.rows.map(usr=>{
            rollBackMap[dataTables.users].push(usr.id);
        });
        var userReturn = await getUser(client, user.email);
        if(isClientCreated) await client.end();
        return {
            user: userReturn,
            rollBackMap: rollBackMap
        };
    }catch(err){
        var rollingback =  await rollBack(client, rollBackMap);
        console.log('rolledBack', rollingback);
        console.log('Got error while adding user: '+err);
        if(isClientCreated) await client.end();
        throw err;
    }
}
var getUser = async (client, email) => {
    try {
      const user = await client.sql`SELECT * FROM users WHERE email=${email}`;
      if(user?.rows==null || user?.rows.length==0) return null;
      return user.rows[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw Error('Failed to fetch user.');
    }
  }
var authenticateUser = async (client, user) =>{
    var isClientCreated = false;
    try{
        if(!client) {
            client = await db.connect();
            isClientCreated = true;
        }
        if(!user.email){
            throw Error('UserAuthenticate01');
        }
        //console.log(user.email);
        var dbUser = await getUser(client, user.email);
        //console.log(dbUser);
        if(!dbUser){
            throw Error('UserAuthenticate02');
        }
        const passwordsMatch = await bcrypt.compare(user.password, dbUser.password);

        //console.log(passwordsMatch);
        if(isClientCreated) await client.end();
        return {
            user: passwordsMatch? dbUser : null,
        };
    }catch(err){
        console.log('Got error while adding user: '+err);
        if(isClientCreated) await client.end();
        throw err;
    }
}

var generateSession = async (client, sessionUser) =>{
    console.log('generateSession');
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
        console.log(error);
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
        console.log(userId);
        const userSessions = await client.sql`SELECT * FROM usersessions WHERE user_id = ${userId} ORDER BY createdDate DESC`;
        console.log(userSessions);
        if(isClientCreated) await client.end();
        return userSessions;
    }catch(err){
        console.log(err);
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
        console.log(sessionIds);
        var sessionsToDelete = '(\''+sessionIds.join('\',\'')+'\')';
        console.log(sessionsToDelete);
        const deletedUserSessions = await client.query(`DELETE FROM usersessions WHERE id IN ${sessionsToDelete}`);
        console.log(deletedUserSessions);
        if(isClientCreated) await client.end();
        return {
            deletedUserSessions: deletedUserSessions
        }
    }catch(err){
        console.log(err);
        if(isClientCreated) await client.end();
        throw err;
    }
}

export {saveUser, authenticateUser, generateSession, getSession};