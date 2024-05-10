import Image from "next/image";
import styles from "../page.module.css";
import Header from "../../../templates/Header";
import SignUpForm from "./components/SignUpForm";

export default async function Home() {

    return (
    <main className={styles.body_container}>
        <Header/>
        <div className={styles.form_wrapper}>
            <SignUpForm/>
        </div>
    </main>
    );
}
