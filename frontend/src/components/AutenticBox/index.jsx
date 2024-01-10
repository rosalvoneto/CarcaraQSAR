import { useNavigate } from 'react-router-dom';
import Input from '../Input';
import styles from './styles.module.css';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

export default function AuntenticBox({ setRegisterBoxAppears }) {

  const handleRegisterBox = () => {
    setRegisterBoxAppears(true);
  }

  const navigate = useNavigate();
  const handleToHomePage = () => {
    navigate('/home');
  }

  const { loginUser } = useContext(AuthContext);

  return(
    <form onSubmit={loginUser} className={styles.container}>
      <h4 className={styles.title}>Auntenticação</h4>

      <div className={styles.inputsContainer}>
        <Input inputName={'email'} name={"Email"} type={'email'}/>
        <div className={styles.inputContainer}>
          <Input inputName={'password'} name={"Senha"} type={'password'}/>
          <a className={styles.link}>Esqueci a senha</a>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <input 
          type='submit'
          className={styles.button}
          value={'Entrar'}
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