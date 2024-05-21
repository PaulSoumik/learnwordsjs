'use server'

import { redirect } from 'next/navigation'
import { signUpUser } from '../../../service/logicService/UserAuthenticationController';
import { createUserWordRelation, updateUserWordRelation } from '../../../service/dataService/UserWordRelstionService';
import { dbConnect } from '../../../service/dataService/dbConnect';
import { getUser } from '../../../service/dataService/UserServices';
const bcrypt = require('bcrypt');

export async function handleCreateNotes(formData,initialState){
    console.log(formData);
    if(!formData) return;
    const token = formData.get('token');
    const user = {name: formData.get('word'), email : formData.get('email'), password : formData.get('password')};
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
export async function handleUpdateStatus(userRelId, wordId, userEmail, status){
    if(userRelId==null || status==null) return;
    let noError = false;
    let result = {
        success: false,
        data: null,
        error: null
    };
    var res = {
        success: false,
        data: null,
        error: null
    };
    try{
        console.log('update status');
        client = await dbConnect();
        let userRelrec;
        if(userRelId==null && userEmail==null) throw Error('Not enough data');
        
        if(userRelId==null){
            const user = await getUser(userEmail);
            if(user==null) throw Error('User not found');
            userRelrec = {
                word_id : wordId,
                user_id : user.id,
                status: status,
                notes: null 
            }
            result = await createUserWordRelation(client, userRelrec);
            if(result.success == false && result.data!=null){
                userRelId = result.data.id;
            }
            res.success = result.success;
            res.data= result.data;
            res.error= result.error;
        }
        if(userRelId!=null){
            userRelrec = {
                id : userRelId,
                status: status,
                notes: null 
            }
            result = await updateUserWordRelation(client,userRelrec);
            console.log(result);
            noError = result.success;
            res.success = result.success;
            res.data= result.data;
            res.error= result.error;
        }
    }catch(error){
        console.log(error)
        noError = false;
        res.error= result.error;
    } finally{
        await client.end();
    }
    if(res.error!=null) throw Error(res.error);
    return res;
}
