import Image from "next/image";
import styles from "../page.module.css";
import LoginForm from "./components/LoginForm";
import Header from "../../../templates/Header";

export default async function Home() {

    return (
    <main className={styles.body_container}>
        <Header/>
        <div className={styles.form_wrapper}>
            <LoginForm/>
        </div>
    </main>
    );
}
