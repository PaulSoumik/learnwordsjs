'use client'
import styles from '../words.module.css';
import SentencesCmp from './Sentences';
import SynonymsCmp from './Synonyms';
import {wordsStaticText} from '../../../../staticText/staticText'

export default function WordCarousel({words}) {
    let wordData = [];
    words.forEach((wrd,idx)=>{wordData.push(wrd)});
    console.log('word carousel load', words);
    var handleSynWordClick = (event) =>{
        var slideId = event.currentTarget.getAttribute('data_id');
        var slide = document.getElementsByClassName(styles.carousel_container)[0].childNodes[words.get(slideId).slideIndex];
        var activeSlide = document.getElementsByClassName(styles.carousel_slide+' '+styles.Active);
        activeSlide[0].classList.remove(styles.Active);
        slide.classList.add(styles.Active);
    }
    var handleNext = () =>{
        var slides = document.getElementsByClassName(styles.carousel_container);
        var activeSlide = document.getElementsByClassName(styles.carousel_slide+' '+styles.Active);
        var activeSlideNo = parseInt(activeSlide[0].getAttribute('data_id'));
        activeSlide[0].classList.remove(styles.Active);
        if(activeSlideNo>=slides[0].childNodes.length-1){
            slides[0].firstChild.classList.add(styles.Active);
        }else{
            slides[0].childNodes[activeSlideNo+1].classList.add(styles.Active);
        }

    }
    var handlePrev = () =>{
        var slides = document.getElementsByClassName(styles.carousel_container);
        var activeSlide = document.getElementsByClassName(styles.carousel_slide+' '+styles.Active);
        var activeSlideNo = parseInt(activeSlide[0].getAttribute('data_id'));
        activeSlide[0].classList.remove(styles.Active);
        if(activeSlideNo<=0){
            slides[0].lastChild.classList.add(styles.Active);
        }else{
            slides[0].childNodes[activeSlideNo-1].classList.add(styles.Active);
        }
    }
    return (
        <section className={styles.carousel_wrapper}>
           
            <div className={styles.carousel_container}>
                {wordData.map((word)=>{
                   return (<div className={`${styles.carousel_slide}${word.slideIndex==0? ' '+styles.Active:''}`} key = {word.slideIndex} data_id = {word.slideIndex} data_word_id = {word.Id}>
                        <div className={`${styles.carousel_title_container}`}>
                            <h2 className={`${styles.carousel_title}`}>{word.word?.toUpperCase()}</h2>
                            <div className={`${styles.carousel_body_button_container}`}>
                                    <div className={styles.carousel_next_prev_button_container}>
                                        <div className={styles.carousel_prev}>
                                            <button onClick={handlePrev}>&larr; {wordsStaticText.previous}</button>
                                        </div>
                                        <div className={styles.carousel_next}> 
                                            <button onClick={handleNext}>{wordsStaticText.next} &rarr;</button>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <div className={`${styles.carousel_body}`}>
                            <p className={`${styles.carousel_body_text}`}>{wordsStaticText.description}: {word.definition}</p>
                            <div>
                                <div>
                                <SynonymsCmp synonyms = {word.synonyms} handleWordClick={handleSynWordClick}/>
                                </div>
                            </div>

                            <div>
                                <SentencesCmp sentences={word.sentences}/>
                            </div>
                        </div>
                    </div>)
                        
                })}
            </div>
            
        </section>
    );
}
