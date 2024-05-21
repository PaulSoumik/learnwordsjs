'use client'
import styles from './styles/carousel.module.css';
import {useState} from "react"

export default function Carousel({items}) {
    const [activeSlide, setActiveSlide] = useState(0);
    var handleNext = () =>{
        var slides = document.getElementsByClassName(styles.carousel_container)[0].childNodes;
        slides[activeSlide].classList.remove(styles.Active);
        var nextActiveSlide = parseInt(activeSlide)+1;
        if(nextActiveSlide>slides.length-1){
         nextActiveSlide = 0;
        }
        slides[nextActiveSlide].classList.add(styles.Active);
        setActiveSlide(parseInt(nextActiveSlide));

    }
    var handlePrev = () =>{
       var slides = document.getElementsByClassName(styles.carousel_container)[0].childNodes;
       slides[activeSlide].classList.remove(styles.Active);
       var nextActiveSlide = parseInt(activeSlide)-1;
       if(nextActiveSlide<0){
        nextActiveSlide = slides.length-1;
       }
       slides[nextActiveSlide].classList.add(styles.Active);
       setActiveSlide(parseInt(nextActiveSlide));
    }
    return (
        <section className={styles.carousel_wrapper}>
            <div className={styles.carousel_prev}>
                <button onClick={handlePrev}>&lt;</button>
            </div>
            <div className={styles.carousel_container}>
                {items.map((item, index)=>{
                   return (
                   <div className={`${styles.carousel_slide}${index==0? ' '+styles.Active:''}`} key = {index} data_id = {index}>
                        <div className={`${styles.carousel_title_container}`}>
                            <h2 className={`${styles.carousel_title}`}>{item.word.toUpperCase()}</h2>
                        </div>
                        <div className={`${styles.carousel_body}`}>
                            <p className={`${styles.carousel_body_text}`}>{index}. {item.definition}</p>
                            <div className={`${styles.carousel_body_button_container}`}>
                                <button className={`${styles.carousel_body_button_red}`}>Check Sentences</button>
                            </div>
                        </div>
                    </div>
                    )
                        
                })}
            </div>
            <div className={styles.carousel_next}> 
                <button onClick={handleNext}>&gt;</button>
            </div>
        </section>
    );
}
