
import { redirect } from 'next/navigation'
import Logout from "./components/Logout";
import { cookies } from 'next/headers';
import Header from '../../../common/Header'
import { isUserSessionValid } from '../../../service/dataService/UserSessionService';
export default async function LogoutPage() {
    
    const isValidSession = cookies().get('useremail') && cookies().get('sessionId')? await isUserSessionValid(cookies().get('useremail').value,cookies().get('sessionId').value) : false;
    if(isValidSession==false) redirect('/')
        
    return (
        <main>
            <Header isValidSession={isValidSession}/>
            <Logout useremail={cookies().get('useremail').value}/>
        </main>
    );
}
