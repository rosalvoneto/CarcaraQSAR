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
      <h4 className={styles.title}>Cadastro</h4>

      <div className={styles.inputsContainer}>
        <Input inputName={'email'} name={"Email"} type={'email'}/>
        <Input inputName={'username'} name={"Nome"} type={'text'}/>
        <Input inputName={'country'} name={"País"} type={'text'}/>
        <Input 
          inputName={'institution'} 
          name={"Instituição/Departamento"} 
          type={'text'}
        />
        <Input inputName={'password'} name={"Senha"} type={'password'}/>
      </div>

      <div className={styles.buttonContainer}>
        <input
          type='submit'
          className={styles.button}
          value={'Registrar'}
        />
        <a 
          className={styles.centerLink}
          onClick={handleAutenticBox}
        >
          Já tem uma conta? Se autentique
        </a>
      </div>
    </form>
  )
}