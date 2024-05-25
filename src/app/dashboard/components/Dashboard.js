'use client'

import styles from '../styles/dashboard.module.css';
import parse from 'html-react-parser';


const Styles = {
  'width': '45%'
}

export default function Dashboard({dashboardData, username}) {
    var styleInreview = {
      'width':dashboardData.inreview*100/dashboardData.totalwords+'%'
    }
    var styleInrecheck = {
      'width':dashboardData.inrecheck*100/dashboardData.totalwords+'%'
    }
    var styleUnmarked = {
      'width':dashboardData.unmarked*100/dashboardData.totalwords+'%'
    }
    var styleCompleted = {
      'width':dashboardData.completed*100/dashboardData.totalwords+'%'
    }
    var textToShow = '';
    if(dashboardData.unmarked/dashboardData.totalwords>0.3){
      textToShow = 'You have a long way to go, keep learning!'
    }else{
      textToShow = 'You are doing great, keep learning!'
    }

    return (
      <section>
        <h2>{textToShow}</h2>
        <div className="flex_container grid-col-2-all">
          <div className='flex-card flex-grid-item'>
              <h5 className='flex-card-title'>In Review</h5>
              <div className='flex-card-description'>
                <p>{dashboardData.inreview}/{dashboardData.totalwords}</p>
                <div className={styles.progress_bar} style={styleInreview}></div>
              </div>
          </div>
          <div className='flex-card flex-grid-item'>
              <h5 className='flex-card-title'>In Recheck</h5>
              <div className='flex-card-description'>
                <p>{dashboardData.inrecheck}/{dashboardData.totalwords}</p>
                <div className={styles.progress_bar} style={styleInrecheck}></div>
              </div>
          </div>
          <div className='flex-card flex-grid-item'>
              <h5 className='flex-card-title'>Unchecked</h5>
              <div className='flex-card-description'>
                <p>{dashboardData.unmarked}/{dashboardData.totalwords}</p>
                <div className={styles.progress_bar} style={styleUnmarked}></div>
              </div>
          </div>
          <div className='flex-card flex-grid-item'>
              <h5 className='flex-card-title'>Completed</h5>
              <div className='flex-card-description'>
                <p>{dashboardData.completed}/{dashboardData.totalwords}</p>
                <div className={styles.progress_bar} style={styleCompleted}></div>
              </div>
          </div>
         </div>
      </section>
    );
}
