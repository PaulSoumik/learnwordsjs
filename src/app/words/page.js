import Image from "next/image";
import { fetchWords } from "../../../service/WordService";
import WordCarousel from "./components/WordCarousel";
import styles from "../page.module.css";
import { getWordsUserDataAll } from "../../../service/UserWordsDataService";
import Header from '../../../templates/Header'

export default async function Words() {
  
  const words = await getWordsUserDataAll();
  
  if(!words){
    return (<section>Loading...</section>)
  }
  return (
    <main className={styles.body_container}>
      <Header/>
      <div>
        <WordCarousel words = {words}/>
      </div>
    </main>
  );
}
