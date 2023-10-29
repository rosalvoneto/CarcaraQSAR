import { useNavigate } from 'react-router-dom';
import Input from '../Input';
import styles from './styles.module.css';

export default function RegisterBox({ setRegisterBoxAppears }) {

  const handleAutenticBox = () => {
    setRegisterBoxAppears(false);
  }

  const navigate = useNavigate();
  const handleToHomePage = () => {
    navigate('/home');
  }

  return(
    <div className={styles.container}>
      <h4 className={styles.title}>Cadastro</h4>

      <div className={styles.inputsContainer}>
        <Input name={"Nome"}/>
        <Input name={"Email"}/>
        <Input name={"Senha"}/>
        <Input name={"País"}/>
        <Input name={"Instituição/Departamento"}/>
      </div>

      <div className={styles.buttonContainer}>
        <button 
          className={styles.button}
          onClick={handleToHomePage}
        >
          Registrar
        </button>
        <a 
          className={styles.centerLink}
          onClick={handleAutenticBox}
        >
          Já tem uma conta? Se autentique
        </a>
      </div>
    </div>
  )
}