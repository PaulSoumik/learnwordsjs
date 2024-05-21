'use client'
import styles from './styles/signupdirect.module.css';
import {useState} from "react"
import Link from 'next/link'

export default function SignUpDirect({isLoggedIn, isValidSession}) {
   console.log(isValidSession);
    return (
        <section className={styles.signup_direct_container}>
            <div className={styles.signup_direct_text}>
                To keep track of your progress and improved learning experience sign up here -
            </div>
            <div className={styles.signup_direct_button}>
                <button>sign up</button>
            </div>
           
        </section>
    );
}
