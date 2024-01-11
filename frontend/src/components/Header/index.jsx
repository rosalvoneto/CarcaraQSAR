import styles from './styles.module.css';

import defaultUserImage from '../../assets/defaultUserImage.svg';
import { Navigate, redirect } from 'react-router-dom';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import { logoutUser } from '../../api/user';

export function Header({ title }) {

  const jwt_token = Cookies.get('jwt_token');
  let userName = "";

  if(jwt_token) {
    userName = jwtDecode(Cookies.get('jwt_token')).username;
  }

  return(
    <div className={styles.container}>
      <p className={styles.title}>
        { title }
      </p>

      <div className={styles.userContainer}>
        <div className={styles.div}>
          <p className={styles.username}>{ userName }</p>
          <a className={styles.logout} onClick={logoutUser}>Sair</a>
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