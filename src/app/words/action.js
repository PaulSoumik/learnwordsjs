'use server'

import { redirect } from 'next/navigation'
import { signUpUser } from '../../../service/logicService/UserAuthenticationController';
import { createUserWordRelation, updateUserWordRelation } from '../../../service/dataService/UserWordRelstionService';
import { dbConnect } from '../../../service/dataService/dbConnect';
import { getUser } from '../../../service/dataService/UserServices';
import { addNewNotes, deleteUserNotes, updateWordStatus } from '../../../service/logicService/WordRelationController';
import { revalidatePath } from 'next/cache';
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
    var res = await updateWordStatus(userRelId, wordId, userEmail, status);
    if(!res || !res.success) return;
    revalidatePath('/words')
}
export async function handleAddNotes(wordId, userEmail, note){
    var res = await addNewNotes(wordId, userEmail, note);
    if(!res || !res.success) return;
    revalidatePath('/words')
}
export async function handleDeleteNote(noteId){
    var res = await deleteUserNotes(noteId);
    if(!res || !res.success) return;
    revalidatePath('/words');
}