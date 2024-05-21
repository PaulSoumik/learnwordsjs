'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

export async function handlelogOutCookies(){
    try{
        console.log('deleting cookies');
        cookies().delete('username');
        cookies().delete('useremail');
        cookies().delete('sessionId');
        console.log(cookies().getAll())
    }catch(error){
        console.log(error)
    } finally{
    }
}