'use client'
import Image from "next/image";
import styles from "../styles/signup.module.css";
import { handleSignUp } from "../action";
import {useFormState} from 'react-dom'
const initialState = {
  message: null,
}
export default function SignUpForm() {
  const [state, formAction] = useFormState(handleSignUp , initialState);
  console.log(formAction);
  return (
      <div className={styles.form_container}>
        <form action={handleSignUp}>
            <input type="text" name="username" placeholder="UserName" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="text" name="token" placeholder="security token" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login &rarr;</button>
        </form>
      </div>
  );
}
