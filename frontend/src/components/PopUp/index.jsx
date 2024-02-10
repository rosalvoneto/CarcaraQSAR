import { useState } from 'react';
import styles from './styles.module.css';

export default function PopUp({ 
  show, title, description, buttonName, action 
}) {

  return(
    <div 
      className={styles.fade}
      style={
        show
        ? {}
        : { display: 'none' } 
      }
    >
      <div className={styles.popup}>
        <h4 className={styles.popupTitle}>
          {title}
        </h4>
        <p className={styles.popupDescription}>
          {description}
        </p>
        <button 
          className={styles.popupButton}
          onClick={() => action()}
        >
          {buttonName}
        </button>
      </div>
    </div>
  )
}