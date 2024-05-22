import Image from "next/image";
import WordCarousel from "./components/WordCarousel";
import styles from "./words.module.css";
import { getWordsUserDataAll, getWordsUserData, updateWordStatus } from "../../../service/logicService/WordRelationController";
import Header from '../../../common/Header'
import { cookies } from "next/headers";
import { isUserSessionValid } from "../../../service/dataService/UserSessionService";
import SignUpDirect from "../../../common/SignUpDirect";
import { handlelogOutCookies } from "../../../serverAction/actionLogout";

export const metadata = {
  title: 'WordSafari | Words',
};

export default async function Words() {
  const isLoggerIn = cookies().get('sessionId')!=null;
  //const userEmail = cookies().get('useremail');
  //console.log(userEmail);
  //console.log('words page');
  //console.log(cookies().getAll());
  //var res = await updateWordStatus(null, 'e6226ac1-6cb4-47c7-a098-b1ac7ff3612f', 'adminUser@yopmail.com','In Review');
  //console.log('word rel creation',res);
  const isValidSession = cookies().get('useremail')!=null && cookies().get('sessionId')!=null? await isUserSessionValid(cookies().get('useremail').value,cookies().get('sessionId').value) : false;
  //console.log('Validation words: '+ isValidSession);
  const userEmail = cookies().get('useremail')!=null? cookies().get('useremail').value : null;
  const words = await getWordsUserData(isValidSession, userEmail);
  //console.log(words);

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
