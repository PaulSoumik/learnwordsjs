import Image from "next/image";
import styles from "./login.module.css";
import LoginForm from "./components/LoginForm";
import Header from "../../../common/Header";
import Link from "next/link";
import { cookies } from "next/headers";
import { isUserSessionValid } from "../../../service/dataService/UserSessionService";

export default async function Login() {
    const isValidSession = cookies().get('useremail') && cookies().get('sessionId')? await isUserSessionValid(cookies().get('useremail').value,cookies().get('sessionId').value) : false;
    return (
    <main className='body_container'>
        <Header/>
        <div className="body_content">
            {!isValidSession &&
            <div className='form_wrapper'>
                <LoginForm/>
            </div>}
            {isValidSession &&
            <div className={styles.form_wrapper}>
                User already logged in, visit - 
                <Link href="/words">words</Link>
            </div>}
        </div>
    </main>
    );
}
