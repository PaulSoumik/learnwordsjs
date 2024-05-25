import Image from "next/image";
import Header from "../../../common/Header";
import { cookies } from "next/headers";
import { isUserSessionValid } from "../../../service/dataService/UserSessionService";
import SignUpDirect from "../../../common/SignUpDirect";
import DashboardContainer from "./components/DashboardContainer"
import { Suspense } from "react";
import Loading from "../../../common/Loading";

export const metadata = {
    title: 'WordSafari | Dashboard',
  };

export default async function UserDashboard() {
    console.log('test2');
    const isValidSession = cookies().get('useremail') && cookies().get('sessionId')? await isUserSessionValid(cookies().get('useremail').value,cookies().get('sessionId').value) : false;
    return (
    <main className='body_container'>
        <Header isValidSession={isValidSession}/>
        <div className="body_content">

            {isValidSession?
                <div>
                    <Suspense fallback={<Loading/>}>
                        <DashboardContainer/>
                    </Suspense> 
                </div>
                : <SignUpDirect/>
            }
        </div>
    </main>
    );
}
