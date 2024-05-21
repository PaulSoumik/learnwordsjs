import Image from "next/image";
import Header from "../../common/Header";
import { isUserSessionValid } from "../../service/dataService/UserSessionService";
import { cookies } from "next/headers";
import SignUpDirect from "../../common/SignUpDirect";

export default async function Home() {
  const isLoggerIn = cookies().get('sessionId')!=null;
  const isValidSession = cookies().get('useremail') && cookies().get('sessionId')? await isUserSessionValid(cookies().get('useremail').value,cookies().get('sessionId').value) : false;
  

  return (
    <main className='body_container'>
      <Header isLoggedIn={isLoggerIn} isValidSession={isValidSession}/>
      <div className="body_content">
        <div className='description'>
          Test NextJs
        </div>
        {!isValidSession &&
          <div>
            <SignUpDirect isLoggedIn={isLoggerIn} isValidSession={isValidSession}/>
          </div>
        }
      </div>
    </main>
  );
}
