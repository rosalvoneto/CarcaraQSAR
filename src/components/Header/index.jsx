import styles from './styles.module.css';

import defaultUserImage from '../../assets/defaultUserImage.svg';

export function Header({ title, userName }) {
  return(
    <div className={styles.container}>
      <p className={styles.title}>
        { title }
      </p>

      <div className={styles.userContainer}>
        <p className={styles.userName}>{ userName }</p>
        <img 
          src={defaultUserImage} 
          alt="image" 
          className={styles.userImage} 
        />
      </div>

    </div>
  )
}