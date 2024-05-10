'use server'

import { redirect } from 'next/navigation'
import { dbConnect } from "../../../service/dbConnect";
import { cookies } from 'next/headers';
import {authenticateUser, generateSession} from "../../../service/UserServices"; 
const bcrypt = require('bcrypt');

export async function handleLogin(formData,initialState){
    console.log(formData);
    if(!formData) return;
    var authenticateErrorsMap = {
        'UserAuthenticate01':'Email is required to authenticate user',
        'UserAuthenticate02' : 'No user found with the email provided'
    }
        
    const user = {email : formData.get('email'), password : formData.get('password')};
    let noError = true;
    try{
        const client = await dbConnect();
        const loggedInUser = await authenticateUser(client, user);
        if(!loggedInUser || !loggedInUser.user) throw Error('Login failed');
        const sessionId = await generateSession(client, loggedInUser.user);
        if(!sessionId || !sessionId.newSession || !sessionId.newSession.sessionid){
            throw Error('Session creation failed');
        }
        const hashedSessionId =  await bcrypt.hash(sessionId.newSession.sessionid, 10);
        cookies().set('sessionId', hashedSessionId);
        cookies().set('username', loggedInUser.user.name);
        cookies().set('useremail', loggedInUser.user.email);
        
        
        //return {message: 'user logged in'};
    }catch(error){
        //return {message: error};
        console.log(error);
        noError = false;
    } finally{
        if(noError) redirect('/words');
    }
}