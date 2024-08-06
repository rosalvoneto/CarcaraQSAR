import { useEffect, useState } from "react";
import AuntenticBox from "../../components/AutenticBox";
import Logo from "./Logo";

import styles from './styles.module.css';
import RegisterBox from "../../components/RegisterBox";
import Cookies from "js-cookie";

export default function Login() {

  const [registerBoxAppears, setRegisterBoxAppears] = useState(false);

  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    // Função para verificar a autenticação
    const checkAuthentication = () => {
      // Obtém o token do cookie
      const token = Cookies.get('jwt_tokens');

      // Verifica se o token existe e não está expirado
      if(token) {
        // Atualiza o estado para indicar que o usuário está autenticado
        setAuthenticated(true);
        window.location.href = '/home';
      } else {
        // Atualiza o estado para indicar que o usuário não está autenticado
        setAuthenticated(false);
      }
    };

    // Chama a função de verificação ao carregar a página
    checkAuthentication();
  }, []);

  return(
    <>
      <div className={styles.container}>
        <Logo />
        {
          registerBoxAppears
          ? <RegisterBox setRegisterBoxAppears={setRegisterBoxAppears} />
          : <AuntenticBox setRegisterBoxAppears={setRegisterBoxAppears} />
        }
        
      </div>
    </>
  )
}