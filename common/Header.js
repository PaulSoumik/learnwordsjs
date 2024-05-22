'use client'
import styles from './styles/header.module.css';
import {useEffect, useState} from "react"
import Link from 'next/link'
import { handlelogOutCookies } from '../serverAction/actionLogout';
import Head from 'next/head';


export default function Header({isLoggedIn, isValidSession}) {
    console.log('Validation home: '+ isValidSession);
    const [width, setWidth] = useState(0);
    const [showNavMobile, setShowNavMobile] = useState(true);

    const updateWidth = () => {
        const newWidth = window.innerWidth;
        setWidth(newWidth);
        if(newWidth<768){
            setShowNavMobile(false)
        }else{
            setShowNavMobile(true)
        }
    };
    const toggleNav = () =>{
        setShowNavMobile(!showNavMobile);
    }

    useEffect(() => {
        window.addEventListener("resize", updateWidth);
        updateWidth();
    }, []);
    
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
                WordSafari
            </div>
            {width<768 && <div className={styles.header_bread_crumb_mobile} onClick={toggleNav}>-</div>}
            <ul className={styles.header_nav} id=  {showNavMobile? 'Active' : 'Inactive'}>
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
