import styles from './styles.module.css';

import Input from '../Input';

import { useContext } from 'react';

import AuthContext from '../../context/AuthContext';

export default function RegisterBox({ setRegisterBoxAppears }) {

  const { createUser } = useContext(AuthContext);

  const handleAutenticBox = () => {
    setRegisterBoxAppears(false);
  }

  return(
    <form onSubmit={createUser} className={styles.container}>
      <h4 className={styles.title}>Registration</h4>

      <div className={styles.inputsContainer}>
        <Input inputName={'email'} name={"Email"} type={'email'}/>
        <Input inputName={'username'} name={"Name"} type={'text'}/>
        <Input inputName={'country'} name={"Country"} type={'text'}/>
        <Input 
          inputName={'institution'} 
          name={"Institution"} 
          type={'text'}
        />
        <Input inputName={'password'} name={"Password"} type={'password'}/>
      </div>

      <div className={styles.buttonContainer}>
        <input
          type='submit'
          className={styles.button}
          value={'Register'}
        />
        <a 
          className={styles.centerLink}
          onClick={handleAutenticBox}
        >
          Already have an account? Login
        </a>
      </div>
    </form>
  )
}