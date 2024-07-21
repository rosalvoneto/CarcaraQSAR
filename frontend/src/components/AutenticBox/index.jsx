import { useContext } from 'react';

import styles from './styles.module.css';

import AuthContext from '../../context/AuthContext';

import Input from '../Input';

export default function AuntenticBox({ setRegisterBoxAppears }) {

  const handleRegisterBox = () => {
    setRegisterBoxAppears(true);
  }

  const { loginUser } = useContext(AuthContext);

  return(
    <form onSubmit={loginUser} className={styles.container}>
      <h4 className={styles.title}>Autentication</h4>

      <div className={styles.inputsContainer}>
        <Input inputName={'email'} name={"Email"} type={'email'}/>
        <div className={styles.inputContainer}>
          <Input inputName={'password'} name={"Password"} type={'password'}/>
          <a className={styles.link}>Esqueci a senha</a>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <input 
          type='submit'
          className={styles.button}
          value={'Enter'}
        />
        <a 
          className={styles.centerLink}
          onClick={handleRegisterBox}
        >
          Novo por aqui? Crie um conta
        </a>
      </div>
    </form>
  )
}