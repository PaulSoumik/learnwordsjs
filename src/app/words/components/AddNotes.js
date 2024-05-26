'use client'
import { handleAddNotes, handleDeleteNote } from '../action';
import styles from '../words.module.css';
import parse from 'html-react-parser';
import SubSection from '../../../../common/SubSection'

export default function AddNotes({allnotes, wordId, userEmail}) {
  var notes = [];
  allnotes?.map(item=>{
    notes.push({
      id:item.id,
      val: item.notes
    });
  }); 
  const handleDelete = (e) =>{
    console.log(e);
    handleDeleteNote(e.target.getAttribute('data_id'));
  }
  var btnData = {
    'delete': handleDelete
  }
  const logicAddNotes = (e) =>{
    e.preventDefault();
    var noteText = e.target.getElementsByTagName('input').length>0? e.target.getElementsByTagName('input')[0]?.value : null;
    if(noteText!=null){
      handleAddNotes(wordId, userEmail, noteText);
    }
  }
  return (
      <div className={styles.form_container}>
        <div>
        <SubSection data = {notes} title = 'Notes' isList={true} buttonsEnabled={btnData} />
        </div>
        <div className={styles.form_container}>
          <form onSubmit={logicAddNotes}>
              <div className={styles.form_input_container}>
                <input type="text" name="note" placeholder="Note" required />
              </div>
              <button type="submit">add notes &rarr;</button>
          </form>
        </div>
      </div>
  );
}
