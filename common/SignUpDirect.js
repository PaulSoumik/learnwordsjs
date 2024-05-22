'use client'
import styles from './styles/signupdirect.module.css';
import {useState} from "react"
import Link from 'next/link'

export default function SignUpDirect({isLoggedIn, isValidSession}) {
   console.log(isValidSession);
    return (
        <section className={styles.signup_direct_container}>
            <div className={styles.signup_direct_text}>
                Welcome to WordSafari, your ultimate destination for mastering the English language! Whether you&#39;re a beginner, an advanced learner, or someone looking to expand their vocabulary for professional growth, WordSafari offers a treasure trove of resources tailored to your needs.

                <br/>
                <h2 className={styles.signup_direct_why_title}>Why Choose WordSafari?</h2>
                <div className='flex_container grid-col-2-all'>
                    <div className='flex-card flex-grid-item'>
                        <h5 className='flex-card-title'>Comprehensive Word Lists</h5>
                        <p className='flex-card-description'>
                            Our curated word lists cover everything from everyday vocabulary to specialized terms in various fields. Each word comes with definitions, usage examples, and synonyms, making it easier for you to understand and remember.
                        </p>
                    </div>
                    <div className='flex-card flex-grid-item'>
                        <h5 className='flex-card-title'>Interactive Learning Tools</h5>
                        <p className='flex-card-description'>
                            Engage with interactive flashcards designed to make learning fun and effective. Track your progress and stay motivated with our personalized learning paths.
                        </p>
                    </div>
                    <div className='flex-card flex-grid-item'>
                        <h5 className='flex-card-title'>Mobile-Friendly</h5>
                        <p className='flex-card-description'>
                            Learn on the go with our mobile-friendly platform. Access WordSafari from your smartphone or tablet and make the most of your time, wherever you are.
                        </p>
                    </div>
                </div>
                <span>Get Started Today!</span>
                <p>
                    Embark on your journey to vocabulary mastery with WordSafari. Sign up now and take the first step towards achieving your language learning goals. Happy learning!
                </p>
            </div>
            <div>
                <Link className={styles.signup_direct_button} href="/signup">Sign Up</Link>
            </div>
           
        </section>
    );
}
