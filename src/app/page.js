import Image from "next/image";
import styles from "./page.module.css";
import { fetchWords } from "../../service/WordService";

export default async function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        Test NextJs
      </div>
    </main>
  );
}
