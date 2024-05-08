'use client'
import styles from './styles/subsection.module.css';
import parse from 'html-react-parser';

export default function SubSection({data, title, isList, listItemOnClick}) {
    if(!data || data.length==0){
        return (<section></section>);
    }
    var handleSectionShowHide = (event) =>{
        console.log(event);
        var parentNode = event.target;
        event.target.style.transform = 'rotateZ(-90deg)';
        while(parentNode!=null && !parentNode.classList.contains(styles.section_container)){
            parentNode = parentNode.parentNode;
        }
        if(parentNode.getElementsByClassName(styles.section_body)[0]?.classList?.contains(styles.section_body_active)){
            parentNode.getElementsByClassName(styles.section_body)[0].classList.remove(styles.section_body_active);
            //parentNode.getElementsByClassName(styles.section_body)[0].style.height = '0px';
            event.target.style.transform = 'rotateZ(90deg)';
            return;
        }
        parentNode.getElementsByClassName(styles.section_body)[0].classList.add(styles.section_body_active);
        //parentNode.getElementsByClassName(styles.section_body)[0].style.height = 'unset';
        
    }
    return (
        <div className={styles.section_container}>
            <div className={styles.section_header}>
                <p className={styles.section_title}>{title}</p>
                <span className={styles.section_show_hide_btn} onClick={handleSectionShowHide}>&gt;</span>
            </div>
            <div className={styles.section_body}>
                {isList && data.map((listItem, index)=>{
                    
                    return (<p className={listItemOnClick!=null?styles.secton_list_item_clickable : ''} key={!listItem.id?index : listItem.id} data_id = {!listItem.id?index : listItem.id} onClick={listItemOnClick!=null?listItemOnClick:null}>{parse(listItem.val)}</p>)
                })}
                {!isList && data.map((listItem, index)=>{
                    return (<span className={listItemOnClick!=null?styles.secton_list_item_clickable : ''} key={!listItem.id?index : listItem.id} data_id = {!listItem.id?index : listItem.id} onClick={listItemOnClick!=null?listItemOnClick:null}>{parse(listItem.val)};</span>)
                })}
            </div>
            
        </div>
    );
}
