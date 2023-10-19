import styles from './styles.module.css';

import defaultUserImage from '../../assets/defaultUserImage.svg';

export function UserBar({ name }) {
  return(
    <div className={styles.container}>
      <p className={styles.name}>{ name }</p>
      
      <img 
        src={defaultUserImage} 
        alt="image" 
        className={styles.image} 
      />
    </div>
  )
}