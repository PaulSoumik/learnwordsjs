'use client'
import styles from './styles/loading.module.css'

export default function Loading({}) {
    console.log('loading')
    return (
        <div className={styles.spinner_container}>
            <div className={styles.spinner}></div>
        </div>
    );
}
