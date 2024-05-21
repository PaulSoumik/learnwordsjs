'use client'
import Image from "next/image";
import styles from "../styles/login.module.css";
import { handleLogin } from "../action";
import {useFormState} from 'react-dom'
const initialState = {
  message: null,
}
export default function LoginForm() {
  const [state, formAction] = useFormState(handleLogin , initialState);
  console.log(formAction);
  return (
      <div className={styles.form_container}>
        <form action={handleLogin}>
            <div className={styles.form_input_container}>
              <label for ='email'>Email</label>
              <input type="email" name="email" placeholder="Email" required />
            </div>
            <div className={styles.form_input_container}>
              <label for ='password'>Password</label>
              <input type="password" name="password" placeholder="Password" required />
            </div>
            <button type="submit">Login &rarr;</button>
        </form>
      </div>
  );
}
