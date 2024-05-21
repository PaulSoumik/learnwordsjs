'use client'
import styles from './styles/header.module.css';
import {useEffect, useState} from "react"
import Link from 'next/link'
import { handlelogOutCookies } from '../serverAction/actionLogout';


export default function Header({isLoggedIn, isValidSession}) {
    console.log('Validation home: '+ isValidSession);
    
    useEffect(
        () => {
            if(!isValidSession){
                //handlelogOutCookies();
            }
        },
        []
      );
    return (
        <section className={styles.header_container}>
            <div className={styles.header_title}>
                Words
            </div>
            <ul className={styles.header_nav}>
                <li className={styles.header_nav_item}>
                    <Link href="/">Home</Link>
                </li>
                <li className={styles.header_nav_item}>
                    <Link href="/words">words</Link>
                </li>
                {isValidSession && <li className={styles.header_nav_item}>
                    <Link href="/logout">log out</Link>
                </li>}
                {!isValidSession && 
                <li className={styles.header_nav_item}>
                    <Link href="/signup">Sign Up</Link>
                </li>
                }
                {!isValidSession && 
                <li className={styles.header_nav_item + ' ' + styles.header_nav_item_button}>
                    <Link href="/login">login</Link>
                </li>
                }
                
            </ul>
           
        </section>
    );
}
