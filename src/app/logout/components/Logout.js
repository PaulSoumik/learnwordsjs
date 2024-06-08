'use client'
import { redirect } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react';
import { handleSignOut } from '../action';
import { useRouter } from 'next/navigation';
export default function Logoutuser({useremail}) {
    const router = useRouter();
    const [isError, setIsError] = useState(false);
    useEffect( ()=>{
        handleSignOut(useremail).then((res)=>{
            if(res==false){
                setIsError(true);
                router.refresh();
                return;
            }
            redirect('/');
        }).catch(err=>{
            setIsError(true);
            router.refresh();
        });
        
        
    })
    if(isError) return (<div>Retrying logging out</div>); 
    return (
        <div>Logging out</div>
    );
}
