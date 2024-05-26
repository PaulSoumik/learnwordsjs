'use client'
import React, { useEffect, useState, useTransition } from 'react';
import styles from '../words.module.css';
import parse from 'html-react-parser';
import { useRouter } from 'next/navigation';
import { handleUpdateStatus } from '../action';

const statusMap = {
    'new' : 'New',
    'inreview' : 'In Review',
    'recheck' : 'Recheck',
    'completed' : 'Completed'
}
export default function SetStatus({handleUserWordStatusChange, activeStatus, userRelId, wordId, userEmail}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isFetching, setIsFetching] = useState(false);
    const [statusValue, setStatusValue] = useState(statusMap[activeStatus]);
    const [isStatusChange, setIsStatusChange] = useState(false);
    var statuses = ['New', 'In Review', 'Recheck','Completed']
    const isLoading = isFetching || isPending;

    const handleSelectionChange = async (e) => {
        e.preventDefault();
        console.log(e.target.value);
        console.log(e.target.value, userRelId, wordId, userEmail);
        setIsFetching(true);
        setStatusValue(e.target.value);
        //var res = await handleUpdateStatus(userRelId, wordId, userEmail,e.target.value);
        //console.log('data',res)
        
        startTransition(() => {
            handleUpdateStatus(userRelId, wordId, userEmail,e.target.value)
            router.refresh();
            setIsFetching(false);
        });
    };
    return (
        <div className={styles.select_option_container} >
            <select id="status" data_id={userRelId} onChange={handleSelectionChange} value={statusValue!=null? statusValue : 'New'}>
                {!isLoading && statuses.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    );
}
