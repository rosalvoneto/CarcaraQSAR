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
    <form method='GET' className={styles.container}>
      <h4 className={styles.title}>Cadastro</h4>

      <div className={styles.inputsContainer}>
        <Input name={"Nome"} type={'text'}/>
        <Input name={"Email"} type={'email'}/>
        <Input name={"Senha"} type={'password'}/>
        <Input name={"País"} type={'text'}/>
        <Input name={"Instituição/Departamento"} type={'text'}/>
      </div>

      <div className={styles.buttonContainer}>
        <input
          type='submit'
          className={styles.button}
          onClick={handleToHomePage}
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