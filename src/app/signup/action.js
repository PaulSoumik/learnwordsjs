'use server'

import { redirect } from 'next/navigation'
import { dbConnect } from "../../../service/dbConnect";
import { cookies } from 'next/headers';
import {authenticateUser, generateSession, saveUser} from "../../../service/UserServices"; 
const bcrypt = require('bcrypt');

export async function handleSignUp(formData,initialState){
    console.log(formData);
    if(!formData) return;
    var authenticateErrorsMap = {
        'UserAuthenticate01':'Email is required to authenticate user',
        'UserAuthenticate02' : 'No user found with the email provided'
    }
    if(!formData.get('token') || formData.get('token')!='myaminuserisreadyforregister') {
        noError = false;
        throw Error('Invalid token blocking registration');
    }
    const user = {name: formData.get('username'), email : formData.get('email'), password : formData.get('password')};
    let noError = true;
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
        
        
        //return {message: 'user logged in'};
    }catch(error){
        var rollingback =  await rollBack(client, rollBackMap);
        console.log(rollingback);
        //return {message: error};
        console.log(error);
        noError = false;
    } finally{
        if(noError) redirect('/words');
    }
}