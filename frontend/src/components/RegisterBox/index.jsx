import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

import Input from '../Input';

export default function RegisterBox({ setRegisterBoxAppears }) {

  const handleAutenticBox = () => {
    setRegisterBoxAppears(false);
  }

  const navigate = useNavigate();
  const handleToHomePage = () => {
    navigate('/home');
  }

  const createUser = async (e) => {
    e.preventDefault();

    let response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/user/create_user`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          username: e.target.username.value,
          email: e.target.email.value,
          country: e.target.country.value,
          institution: e.target.institution.value,
          password: e.target.password.value
      })
    })

    let dataResponse = await response.json();
    if(response.status == 200) {
      console.log(dataResponse);
      alert(`Usuário "${e.target.username.value}" criado!`);

    } else {
      console.log(`Status: ${response.status}`);
      alert('Algum campo está errado!');
    }
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