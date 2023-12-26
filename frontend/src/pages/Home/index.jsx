
import { DefaultPage } from '../DefaultPage';
import { Header } from '../../components/Header';
import { ProjectsTable } from './ProjectsTable';

import Input from '../../components/Input';

import { userName, recuperarDados } from '../../settings';

import styles from './styles.module.css';

import { useNavigate, redirect, Navigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';

import AuthContext from '../../context/AuthContext';

import Cookies from 'js-cookie';

export function Home() {

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Função para verificar a autenticação
    const checkAuthentication = () => {
      // Obtém o token do cookie
      const token = Cookies.get('jwt_token');
      console.log('TOKEN:', token);

      // Verifica se o token existe e não está expirado
      if(token) {
        // Atualiza o estado para indicar que o usuário está autenticado
        setAuthenticated(true);
      } else {
        // Atualiza o estado para indicar que o usuário não está autenticado
        setAuthenticated(false);
        window.location.href = '/';
      }
    };

    // Chama a função de verificação ao carregar a página
    checkAuthentication();
  }, []);
  
  
  return(
    <>
      {
        authenticated
        && <>
            <Header 
              userName={userName}
            />
            <div className={styles.inputContainer}>
              <Input name={"Todos os projetos"}/>
            </div>
            <ProjectsTable />
          </>
      }
    </>
  )
}