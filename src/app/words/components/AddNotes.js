'use client'
import styles from '../words.module.css';
import parse from 'html-react-parser';

export default function AddNotes({logicAddNotes}) {
    
    const [state, formAction] = useFormState(logicAddNotes , initialState);
  console.log(formAction);
  return (
      <div className={styles.form_container}>
        <form action={logicAddNotes}>
            <input type="text" name="note" placeholder="Note" required />
            <button type="submit">Login &rarr;</button>
        </form>
      </div>
  );
}
