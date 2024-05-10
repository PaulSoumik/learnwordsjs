'use client'
import styles from '../words.module.css';
import {wordsStaticText} from '../../../../staticText/staticText'
import SubSection from '../../../../templates/SubSection'

export default function SynonymsCmp({synonyms, handleWordClick}) {
    if(!synonyms || synonyms.length==0){
        return (<section></section>);
    }
    var preparedData = [];
    synonyms.map(synonym=>{
        preparedData.push({
            id: synonym.id,
            val: synonym.word
        });
    });
    /*
    <div className={styles.setences_container}>
            <div>
                <p>
                    Synonyms:
                </p>
            </div>
            <div>
                {synonyms.map((syn)=>{
                    return (
                        <p key={syn.id} data_id = {syn.id} onClick={handleWordClick}>{syn.word}</p>
                    )
                })}
            </div>
    */
    return (
        <div>
            <SubSection data = {preparedData} title={wordsStaticText.synonyms} isList={false} listItemOnClick = {handleWordClick}/>
        </div>
    );
}
