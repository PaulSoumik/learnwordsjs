import { sql } from '@vercel/postgres';
import { dataTables } from '../../models/dataModels';
import { dbConnect } from './dbConnect';

const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const moment = require('moment');


var saveUser = async (client, user, rollBackMap) =>{
    var isClientCreated = false;
    try{
        if(!client) {
            client = await db.connect();
            isClientCreated = true;
        }
        if(!user.email){
            throw Error('Email is reuired to register user');
        }
        
        var userExisting = await getUser(client, user.email);
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
        if(isClientCreated) await client.end();
        throw err;
    }
}
var getUser = async (client, email) => {
    var isClientCreated = false;
    var userData = null;
    try{
        if(client==null || !client.hasExecuted) {
            client = await dbConnect();
            isClientCreated = true;
        }
        console.log('user get user',email);
        if(email==null) throw Error('Email can\'t be null');

        const user = await client.sql`SELECT * FROM users WHERE email=${email}`;
        if(user?.rows==null || user?.rows.length==0) return null;
        userData =  user.rows[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }finally{
        if(isClientCreated) await client.end();
    }
    return userData;
  }
var authenticateUser = async (client, user) =>{
    var isClientCreated = false;
    try{
        if(client==null) {
            client = await dbConnect();
            isClientCreated = true;
        }
        if(!user.email){
            throw Error('UserAuthenticate01');
        }
        var dbUser = await getUser(client, user.email);
        if(!dbUser){
            throw Error('UserAuthenticate02');
        }
        const passwordsMatch = await bcrypt.compare(user.password, dbUser.password);

        
        if(isClientCreated) await client.end();
        return {
            user: passwordsMatch? dbUser : null,
        };
    }catch(err){
        console.log(err);
        if(isClientCreated) await client.end();
        throw err;
    }
}



export {saveUser, authenticateUser, getUser};