'use client'
import styles from './styles/header.module.css';
import {useState} from "react"
import Link from 'next/link'

export default function Header({isLoggedIn, isValidSession}) {
   console.log(isValidSession);
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
                {isLoggedIn && <li className={styles.header_nav_item}>
                    <Link href="/logout">log out</Link>
                </li>}
                {!isLoggedIn && 
                <li className={styles.header_nav_item}>
                    <Link href="/login">login</Link>
                </li>
                }
                {!isLoggedIn && 
                <li className={styles.header_nav_item}>
                    <Link href="/signup">Sign Up</Link>
                </li>
                }
            </ul>
           
        </section>
    );
}
