import Image from "next/image";
import { fetchWords } from "../../../service/WordService";
import WordCarousel from "./components/WordCarousel";
import styles from "../page.module.css";
import { getWordsUserDataAll } from "../../../service/UserWordsDataService";
import Header from '../../../templates/Header'
import { cookies } from "next/headers";
import { isUserSessionValid } from "../../../service/UserSessionService";
import SignUpDirect from "../../../templates/SignUpDirect";

export default async function Words() {
  const isLoggerIn = cookies().get('sessionId')!=null;
  
  const words = await getWordsUserDataAll();
  const isValidSession = cookies().get('useremail') && cookies().get('sessionId')? await isUserSessionValid(cookies().get('useremail').value,cookies().get('sessionId').value) : false;
  
  if(!words){
    return (<section>Loading...</section>)
  }
  return (
    <main className={styles.body_container}>
      <Header isLoggedIn={isLoggerIn} isValidSession={isValidSession}/>
      {isValidSession && <div>
        <WordCarousel words = {words} cookies={cookies().getAll()}/>
      </div>}
      {!isValidSession &&
        <div>
          <SignUpDirect isLoggedIn={isLoggerIn} isValidSession={isValidSession}/>
        </div>
      }
    </main>
  );
}
