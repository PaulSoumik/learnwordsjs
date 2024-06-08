'use server'

import { redirect } from 'next/navigation'
import { signOutUser, signUpUser } from '../../../service/logicService/UserAuthenticationController';

export async function handleSignOut(email){
   if(email == null) return false;
    try{
        let user = {email: email};
        let result = await signOutUser(user);
        return result;
    }catch(error){
        console.log(error)
    } 
    return false;
}