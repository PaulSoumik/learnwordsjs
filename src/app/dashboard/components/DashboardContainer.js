import Dashboard from "./Dashboard"
import { prepareWordRelationData } from "../../../../service/logicService/WordRelationController";
import { cookies } from "next/headers";

export default async function DashboardContainer() {
    console.log('test1');
    const username = cookies().get('username')!=null?  cookies().get('username').value : '';
    const useremail = cookies().get('useremail')!=null?  cookies().get('useremail').value : '';
    console.log(username);
    const wordReldata = cookies().get('useremail')!= null? await prepareWordRelationData(useremail) : {};
    console.log(wordReldata);

    return (
        <Dashboard dashboardData={wordReldata} username={username}/>
    );
}
