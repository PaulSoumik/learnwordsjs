import { sql, db } from '@vercel/postgres';
const bcyrpt = require('bcrypt');
const moment = require('moment');

async function getUserSession(email) {
    let client = await db.connect();
  try {
    
    const currUser = await client.sql`SELECT Id FROM users WHERE email = ${email}`;
    console.log('validate user',currUser);
    if(currUser?.rows==null || currUser.rows.length==0) return null;
    const currUserSession = await client.sql`SELECT * FROM usersessions WHERE user_id = ${currUser.rows[0].id} ORDER BY createdDate DESC`;
    console.log('validate user',currUserSession);
    if(currUserSession?.rows==null || currUserSession.rows.length == 0) return null;
    return currUserSession.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch session data.');
  } finally{
    await client.end();
  }
}
export async function isUserSessionValid(email, sessionKey) {
    try {
    console.log('validate user',email);
     const userSession = await getUserSession(email);
     console.log(userSession);
     if(!userSession)return false;
     let currDateTime = moment().utc();
     console.log(currDateTime);
     if(currDateTime.isBefore(userSession.validationEnd)){
        return await bcyrpt.compare(userSession.sessionid, sessionKey);
     }
     return false;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to validate session data.');
    }
  }