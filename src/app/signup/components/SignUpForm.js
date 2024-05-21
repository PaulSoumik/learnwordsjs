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
            <div className={styles.form_input_container}>
              <label for='username'>Username</label>
              <input type="text" name="username" placeholder="UserName" required />
            </div>
            <div className={styles.form_input_container}>
            <label for='token'>Security Token</label>
            <input type="text" name="token" placeholder="security token" required />
            </div>
            <div className={styles.form_input_container}>
            <label for='password'>Password</label>
            <input type="password" name="password" placeholder="Password" required />
            </div>
            <button type="submit">Login &rarr;</button>
        </form>
      </div>
  );
}
