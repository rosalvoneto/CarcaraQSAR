import { useState } from 'react';
import styles from './styles.module.css';

export default function PopUp({ 
  children, show, title, description, showButton, buttonName, action
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
        { children }
        <div className={styles.buttonsContainer}>
          {
            showButton &&
            <button 
              className={styles.popupButton}
              onClick={() => action()}
            >
              {buttonName}
            </button>
          }
          {
            /* 
            <button
              onClick={() => closeAction()}
              className={styles.closeButton}
            >
              Fechar
            </button> 
            */
          }
        </div>
      </div>
    </div>
  )
}