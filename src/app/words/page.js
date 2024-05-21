import Image from "next/image";
import WordCarousel from "./components/WordCarousel";
import styles from "./words.module.css";
import { getWordsUserDataAll, getWordsUserData } from "../../../service/logicService/WordRelationController";
import Header from '../../../common/Header'
import { cookies } from "next/headers";
import { isUserSessionValid } from "../../../service/dataService/UserSessionService";
import SignUpDirect from "../../../common/SignUpDirect";
import { handlelogOutCookies } from "../../../serverAction/actionLogout";

export default async function Words() {
  const isLoggerIn = cookies().get('sessionId')!=null;
  //const userEmail = cookies().get('useremail');
  //console.log(userEmail);
  //console.log('words page');
  //console.log(cookies().getAll());
  const isValidSession = cookies().get('useremail')!=null && cookies().get('sessionId')!=null? await isUserSessionValid(cookies().get('useremail').value,cookies().get('sessionId').value) : false;
  //console.log('Validation words: '+ isValidSession);
  const userEmail = cookies().get('useremail')!=null? cookies().get('useremail').value : null;
  const words = await getWordsUserData(isValidSession, userEmail);

  return (
    <main className={styles.body_container}>
      <Header isLoggedIn={isLoggerIn} isValidSession={isValidSession}/>
      <div className="body_content">
        {isValidSession && <div>
          <WordCarousel words = {words} userEmail={cookies().get('useremail').value}/>
        </div>}
        {!isValidSession &&
          <div>
            <SignUpDirect isLoggedIn={isLoggerIn} isValidSession={isValidSession}/>
          </div>
        }
      </div>
    </main>
  );
}
