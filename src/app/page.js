import Image from "next/image";
import styles from "./page.module.css";
import Header from "../../templates/Header";
import { isUserSessionValid } from "../../service/UserSessionService";
import { cookies } from "next/headers";
import SignUpDirect from "../../templates/SignUpDirect";

export default async function Home() {
  const isLoggerIn = cookies().get('sessionId')!=null;
  const isValidSession = cookies().get('useremail') && cookies().get('sessionId')? await isUserSessionValid(cookies().get('useremail').value,cookies().get('sessionId').value) : false;
  

  return (
    <main className={styles.body_container}>
      <Header isLoggedIn={isLoggerIn}/>
      <div className={styles.description}>
        Test NextJs
      </div>
      {!isValidSession &&
        <div>
          <SignUpDirect isLoggedIn={isLoggerIn} isValidSession={isValidSession}/>
        </div>
      }
    </main>
  );
}
