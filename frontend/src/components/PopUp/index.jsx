import styles from './styles.module.css';

export default function PopUp({ 
  children, show, title, description, showButton, buttonName, action,
  showSecondButton, secondButtonName, secondAction 
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
            showSecondButton &&
            <button 
              className={styles.popupButton}
              onClick={() => secondAction()}
            >
              {secondButtonName}
            </button>
          }
        </div>
      </div>
    </div>
  )
}