'use client'
import styles from '../words.module.css';
import parse from 'html-react-parser';
import {wordsStaticText} from '../../../../staticText/staticText'
import SubSection from '../../../../templates/SubSection'

export default function SentencesCmp({sentences}) {
    console.log(sentences);
    if(!sentences || sentences.length==0){
        return (<section></section>);
    }
    var preparedData = [];
    sentences.map(sentence=>{
        preparedData.push({
            id: sentence.id,
            val: sentence.sentence.split(sentence.word).join(`<span className='${styles.sentence_highlight}'> ${sentence.word} </span>`)
        });
    });
    return (
        <SubSection data = {preparedData} title = {wordsStaticText.sentences} isList={true}/>
    );
}
