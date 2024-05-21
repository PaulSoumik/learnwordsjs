import { dbConnect } from "../dataService/dbConnect";
import { cookies } from 'next/headers';
import {authenticateUser} from "../dataService/UserServices"; 
import {generateSession} from "../dataService/UserSessionService";
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
    if(!token || token!='myaminuserisreadyforregister') {
        throw Error('Invalid token blocking registration');
    }
    try{
        var rollBackMap = [];
        const client = await dbConnect();
        const signUpUser = await saveUser(client, user, rollBackMap);
        rollBackMap = signUpUser.rollBackMap;
        if(!signUpUser || !signUpUser.user) throw Error('User creation failed');
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
        var rollingback =  await rollBack(client, rollBackMap);
        return {
            rolledBack: rollingback,
            success: false,
            message: error
        };
    }
}
export {loginUser, signUpUser};