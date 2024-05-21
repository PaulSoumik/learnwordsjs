'use server'

import { redirect } from 'next/navigation'
import { loginUser } from '../../../service/logicService/UserAuthenticationController';

export async function handleLogin(formData,initialState){
    console.log(formData);
    if(!formData) return;    
    const user = {email : formData.get('email'), password : formData.get('password')};
    let noError = false;
    let result;
    try{
        result = await loginUser(user);
        console.log(result);
        noError = result.success;
    }catch(error){
        console.log(error);
        noError = false;
    } finally{
        if(noError) redirect('/words');
    }
}