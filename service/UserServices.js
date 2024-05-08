import { sql } from '@vercel/postgres';

const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');


var saveUser = async (client, user) =>{
    var isClientCreated = false;
    try{
        if(!client) {
            client = await db.connect();
            isClientCreated = true;
        }
        if(!user.email){
            throw Error('Email is reuired to register user');
        }
        var user = await getUser(client, user.email);
        if(user){
            throw Error('User with the same email already exists');
        }
        const insertedUser = await Promise.all(async () => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return sql `
            INSERT INTO users (name, email, password)
            VALUES (${user.name}, ${user.email}, ${hashedPassword})
            ON CONFLICT (id) DO NOTHING;`;
        });
    
        //console.log(`Added ${insertedUser} user`);
        if(isClientCreated) await client.end();
        return {
            user: insertedUser,
        };
    }catch(err){
        console.log('Got error while adding user: '+err);
        if(isClientCreated) await client.end();
        throw err;
    }
}
var getUser = async (client, email) => {
    try {
      const user = await client.sql`SELECT * FROM users WHERE email=${email}`;
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
        var sessionId = await bcrypt.hash(sessionUser.id+ (Math.random())*25100, 10);
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

        const insertedSession = await client.sql `
            INSERT INTO usersessions (sessionid, user_id, createdDate)
            VALUES (${sessionId}, ${sessionUser.id}, ${new Date()})
            ON CONFLICT (id) DO NOTHING;`;
        if(insertedSession.rowCount==0) throw Error('Session creation failed');
        const newUserSessions = await getSession(client, sessionUser.id);
        if(!newUserSessions || !newUserSessions.rows || newUserSessions.rowCount==0) throw Error('Session creation failed');
        if(isClientCreated) await client.end();
        return {
            newSession : newUserSessions.rows[0]
        }

    }catch(error){
        console.log(err);
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