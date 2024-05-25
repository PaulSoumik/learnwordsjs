import WordCarousel from "./WordCarousel";
import {getWordsUserData} from "../../../../service/logicService/WordRelationController";
import { cookies } from "next/headers";

export default async function WordsPage({isValidSession}) {
  const userEmail = cookies().get('useremail')!=null? cookies().get('useremail').value : null;
  const words = await getWordsUserData(isValidSession, userEmail);
  //console.log(words);

  return (
    <WordCarousel words = {words} userEmail={cookies().get('useremail').value}/> 
  );
}
