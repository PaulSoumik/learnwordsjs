import Image from "next/image";
import Header from "../../common/Header";
import { isUserSessionValid } from "../../service/dataService/UserSessionService";
import { cookies } from "next/headers";
import SignUpDirect from "../../common/SignUpDirect";

export const metadata = {
  title: 'WordSafari | Welcome',
};

export default async function Home() {
  const isLoggerIn = cookies().get('sessionId')!=null;
  const username = cookies().get('username')!=null? cookies().get('username').value : 'User';
  const isValidSession = cookies().get('useremail') && cookies().get('sessionId')? await isUserSessionValid(cookies().get('useremail').value,cookies().get('sessionId').value) : false;
  

  return (
    <main className='body_container'>
      <Header isLoggedIn={isLoggerIn} isValidSession={isValidSession}/>
      <div className="body_content">
        {isValidSession && 
            <section>
              <h5 className="thin_mid_font">Hello, {username}</h5>
              <div className="thin_small_font">
                  Welcome to WordSafari, your ultimate destination for mastering the English language! Whether you're a beginner, an advanced learner, or someone looking to expand their vocabulary for professional growth, WordSafari offers a treasure trove of resources tailored to your needs.

                  <br/>
                  <h2 className="thin_big_font">Why Choose WordSafari?</h2>
                  <div className='flex_container grid-col-2-all'>
                      <div className='flex-card flex-grid-item'>
                          <h5 className='flex-card-title'>Comprehensive Word Lists</h5>
                          <p className='flex-card-description'>
                              Our curated word lists cover everything from everyday vocabulary to specialized terms in various fields. Each word comes with definitions, usage examples, and synonyms, making it easier for you to understand and remember.
                          </p>
                      </div>
                      <div className='flex-card flex-grid-item'>
                          <h5 className='flex-card-title'>Interactive Learning Tools</h5>
                          <p className='flex-card-description'>
                              Engage with interactive flashcards designed to make learning fun and effective. Track your progress and stay motivated with our personalized learning paths.
                          </p>
                      </div>
                      <div className='flex-card flex-grid-item'>
                          <h5 className='flex-card-title'>Mobile-Friendly</h5>
                          <p className='flex-card-description'>
                              Learn on the go with our mobile-friendly platform. Access WordSafari from your smartphone or tablet and make the most of your time, wherever you are.
                          </p>
                      </div>
                  </div>
              </div>
            </section>
        }
        {!isValidSession &&
          <div>
            <SignUpDirect isLoggedIn={isLoggerIn} isValidSession={isValidSession}/>
          </div>
        }
      </div>
    </main>
  );
}
