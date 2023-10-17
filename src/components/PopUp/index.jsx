
import { useState } from 'react';
import styles from './styles.module.css';

export default function PopUp({ show }) {

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
          Título
        </h4>
        <p className={styles.popupDescription}>
          Descrição
        </p>
        <a 
          className={styles.popupButton}
          onClick={() => setShowPopup(false)}
        >
          Botão
        </a>
      </div>
    </div>
  )
}