import Image from "next/image";
import styles from "./signup.module.css";
import Header from "../../../common/Header";
import SignUpForm from "./components/SignUpForm";
import { cookies } from "next/headers";
import { isUserSessionValid } from "../../../service/dataService/UserSessionService";

export default async function SignUp() {
    const isValidSession = cookies().get('useremail') && cookies().get('sessionId')? await isUserSessionValid(cookies().get('useremail').value,cookies().get('sessionId').value) : false;
    return (
    <main className='body_container'>
        <Header/>
        <div className="body_content">
            {!isValidSession && 
            <div className='form_wrapper'>
                <SignUpForm/>
            </div>}
        </div>
    </main>
    );
}
