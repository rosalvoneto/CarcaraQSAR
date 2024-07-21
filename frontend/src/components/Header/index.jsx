import styles from './styles.module.css';

import defaultUserImage from '../../assets/defaultUserImage.svg';

import AuthContext from '../../context/AuthContext';
import { useContext } from 'react';

export function Header({ title }) {

  const { decodifiedAccessToken, logoutUser } = useContext(AuthContext)

  return(
    <div className={styles.container}>
      <p className={styles.title}>
        { title }
      </p>

      <div className={styles.userContainer}>
        <div className={styles.div}>
          <p className={styles.username}>
            {
              decodifiedAccessToken &&
              decodifiedAccessToken.username
            }
          </p>
          <a className={styles.logout} onClick={logoutUser}>Log out</a>
        </div>
        <img 
          src={defaultUserImage} 
          alt="image" 
          className={styles.userImage} 
        />
      </div>

    </div>
  )
}