import styles from './styles.module.css';

import defaultUserImage from '../../assets/defaultUserImage.svg';
import { Navigate, redirect } from 'react-router-dom';

import Cookies from 'js-cookie';

export function Header({ title, userName }) {

  const logout = () => {
    Cookies.remove('jwt_token');
    window.location.href = '/';
  }

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
        <a className={styles.logout} onClick={logout}>Logout</a>
      </div>

    </div>
  )
}