import { dbConnect, rollBack } from "../dataService/dbConnect";
import { cookies } from 'next/headers';
import {authenticateUser, getUser, saveUser} from "../dataService/UserServices"; 
import {deleteOlderSessions, generateSession, getSession, getUserSession} from "../dataService/UserSessionService";
const bcrypt = require('bcrypt');

var loginUser = async (user) => {
    if(!user) return;
    var loginErrorsMap = {
        'UserLogInFailure01':'Authentiction failed',
        'UserLogInFailure02':'Session creation failed'
    }
    try{
        const client = await dbConnect();
        const loggedInUser = await authenticateUser(client, user);
        if(!loggedInUser || !loggedInUser.user) throw Error(loginErrorsMap['UserLogInFailure01']);
        const sessionId = await generateSession(client, loggedInUser.user);
        if(!sessionId || !sessionId.newSession || !sessionId.newSession.sessionid){
            throw Error(loginErrorsMap['UserLogInFailure02']);
        }
        const hashedSessionId =  await bcrypt.hash(sessionId.newSession.sessionid, 10);
        cookies().set('sessionId', hashedSessionId);
        cookies().set('username', loggedInUser.user.name);
        cookies().set('useremail', loggedInUser.user.email);
        return {
            success: true,
            message: 'User logged in'
        };
    }catch(error){
        return {
            success: false,
            message: error
        };
    } 
}

var signUpUser = async (user, token) =>{
    if(!user) return;
    if(!token || token!=process.env.USER_SIGNUP_TOKEN) {
        throw Error('Invalid token blocking registration');
    }
    let client = null;
    try{
        var rollBackMap = [];
        client = await dbConnect();
        const signUpUser = await saveUser(client, user, rollBackMap);
        if(signUpUser==null || signUpUser.user==null) throw Error('User creation failed');
        rollBackMap = signUpUser.rollBackMap;
        
        const sessionId = await generateSession(client, signUpUser.user);
        if(!sessionId || !sessionId.newSession || !sessionId.newSession.sessionid){
            throw Error('Session creation failed');
        }
        const hashedSessionId =  await bcrypt.hash(sessionId.newSession.sessionid, 10);
        cookies().set('sessionId', hashedSessionId);
        cookies().set('username', signUpUser.user.name);
        cookies().set('useremail', signUpUser.user.email);
        
        
        return {
            rolledBack: null,
            success: true,
            message: 'user logged in'
        };
    }catch(error){
        if(client ==null) client = await dbConnect();
        var rollingback =  await rollBack(client, rollBackMap);
        return {
            rolledBack: rollingback,
            success: false,
            message: error
        };
    }
}

var signOutUser = async (currUser)=>{
    if(!currUser) return null;
    let client = null;
    try{
        client = await dbConnect();
        const user  =  await getUser(client, currUser.email);
        if(user==null) throw Error('No user found');
        const sessions = await getSession(client, user.id);
        let sessionIds = [];
        if(sessions.rowCount==0) return true;
        sessions.rows.forEach(session => {
            sessionIds.push(session.id);
        });
        const delSessions = await deleteOlderSessions(client, sessionIds);
        if(delSessions==null || delSessions.rowCount == null || delSessions.rowCount==0) return false;
        return true;
    }catch(err){
        console.log(err);
    }finally{
        await client.end()
    }
    return false;
}
export {loginUser, signUpUser, signOutUser};