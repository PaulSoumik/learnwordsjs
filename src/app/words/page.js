import Image from "next/image";
import WordCarousel from "./components/WordCarousel";
import styles from "./words.module.css";
import { getWordsUserDataAll, getWordsUserData, updateWordStatus } from "../../../service/logicService/WordRelationController";
import Header from '../../../common/Header'
import { cookies } from "next/headers";
import { isUserSessionValid } from "../../../service/dataService/UserSessionService";
import SignUpDirect from "../../../common/SignUpDirect";
import { handlelogOutCookies } from "../../../serverAction/actionLogout";
import WordsPage from "./components/WordPage";
import { Suspense } from "react";
import Loading from "../../../common/Loading";

export const metadata = {
  title: 'WordSafari | Words',
};

export default async function Words() {
  const sessionID = cookies().get('sessionId')!=null? cookies().get('sessionId').value : null;
  const isLoggerIn = sessionID!=null;
  const userEmail = cookies().get('useremail')!=null? cookies().get('useremail').value : null;
  const isValidSession = userEmail!=null && sessionID!=null? await isUserSessionValid(userEmail,sessionID) : false;
  //const words = await getWordsUserData(isValidSession, userEmail);
  //console.log(words); <WordCarousel words = {words} userEmail={cookies().get('useremail').value}/>

  return (
    <main className={styles.body_container}>
      <Header isLoggedIn={isLoggerIn} isValidSession={isValidSession}/>
      <div className="body_content">
        {isValidSession && <div>
          <Suspense fallback={<Loading/>}>
            <WordsPage isValidSession={isValidSession}/>
          </Suspense>
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
