import { useNavigate } from 'react-router-dom';
import Input from '../Input';
import styles from './styles.module.css';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

export default function RegisterBox({ setRegisterBoxAppears }) {

  const handleAutenticBox = () => {
    setRegisterBoxAppears(false);
  }

  const navigate = useNavigate();
  const handleToHomePage = () => {
    navigate('/home');
  }

  const { loginUser } = useContext(AuthContext);

  return(
    <form method='POST' onSubmit={() => {}} className={styles.container}>
      <h4 className={styles.title}>Cadastro</h4>

      <div className={styles.inputsContainer}>
        <Input inputName={'username'} name={"Nome"} type={'text'}/>
        <Input inputName={'email'} name={"Email"} type={'email'}/>
        <Input inputName={'password'} name={"Senha"} type={'password'}/>
        <Input inputName={'country'} name={"País"} type={'text'}/>
        <Input 
          inputName={'departament'} 
          name={"Instituição/Departamento"} 
          type={'text'}
        />
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