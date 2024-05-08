'use server'

import { redirect } from "next/dist/server/api-utils";
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
    try{
        const client = await dbConnect();
        const loggedInUser = await authenticateUser(client, user);
        if(!loggedInUser || !loggedInUser.user) throw Error('Login failed');
        const sessionId = await generateSession(client, loggedInUser.user);
        if(!sessionId || !sessionId.newSession || !sessionId.newSession.sessionid){
            throw Error('Session creation failed');
        }
        const hashedSessionId =  bcrypt.hash(sessionId.newSession.sessionid, 10);
        cookies().set('sessionId', hashedSessionId);
        
        redirect('/words');
        //return {message: 'user logged in'};
    }catch(error){
        //return {message: error};
    }
}