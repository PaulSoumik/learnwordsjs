'use server'

import { redirect } from 'next/navigation'
import { signOutUser, signUpUser } from '../../../service/logicService/UserAuthenticationController';
import { cookies } from 'next/headers';

export async function handleSignOut(email){
   if(email == null) return false;
    try{
        let user = {email: email};
        let result = await signOutUser(user);
        if(result){
            cookies().delete('sessionId');
            cookies().delete('useremail');
            cookies().delete('username');
        }
        return result;
    }catch(error){
        console.log(error)
    } 
    return false;
}