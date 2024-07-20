
import { Header } from '../../components/Header';
import { SharedProjectsTable } from './SharedProjectsTable';

import Input from '../../components/Input';

import styles from './styles.module.css';

import { useState, useEffect } from 'react';

import Cookies from 'js-cookie';

export default function SharedPage() {

  const [authenticated, setAuthenticated] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Função para atualizar o estado
  const setNewSearchValue = (newSearchValue) => {
    setSearchValue(newSearchValue);

    console.log(newSearchValue);
  };

  useEffect(() => {
    // Função para verificar a autenticação
    const checkAuthentication = () => {
      // Obtém o token do cookie
      const token = Cookies.get('jwt_tokens');
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
        &&  <>
              <Header />
              <div className={styles.inputContainer}>
                <Input name={"Compartilhados"} setValue={setNewSearchValue}/>
              </div>
              <SharedProjectsTable searchValue={searchValue}/>
            </>
      }
    </>
  )
}