import { useNavigate } from 'react-router-dom';
import Input from '../Input';
import styles from './styles.module.css';

export default function AuntenticBox({ setRegisterBoxAppears }) {

  const handleRegisterBox = () => {
    setRegisterBoxAppears(true);
  }

  const navigate = useNavigate();
  const handleToHomePage = () => {
    navigate('/home');
  }

  return(
    <div className={styles.container}>
      <h4 className={styles.title}>Auntenticação</h4>

      <div className={styles.inputsContainer}>
        <Input name={"Email"}/>
        <div className={styles.inputContainer}>
          <Input name={"Senha"}/>
          <a className={styles.link}>Esqueci a senha</a>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button 
          className={styles.button}
          onClick={handleToHomePage}
        >
          Entrar
        </button>
        <a 
          className={styles.centerLink}
          onClick={handleRegisterBox}
        >
          Novo por aqui? Crie um conta
        </a>
      </div>
    </div>
  )
}