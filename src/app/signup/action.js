'use server'

import { redirect } from 'next/navigation'
import { signUpUser } from '../../../service/logicService/UserAuthenticationController';
const bcrypt = require('bcrypt');

export async function handleSignUp(formData,initialState){
    console.log(formData);
    if(!formData) return;
    const token = formData.get('token');
    const user = {name: formData.get('username'), email : formData.get('email'), password : formData.get('password')};
    let noError = false;
    let result;
    try{
        result = await signUpUser(user, token);
        console.log(result);
        noError = result.success;
    }catch(error){
        console.log(error)
        noError = false;
    } finally{
        if(noError) redirect('/words');
    }
}