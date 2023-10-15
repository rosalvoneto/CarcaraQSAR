import { useState } from "react";
import AuntenticBox from "../../components/AutenticBox";
import Logo from "./Logo";

import styles from './styles.module.css';
import RegisterBox from "../../components/RegisterBox";

export function Login() {

  const [registerBoxAppears, setRegisterBoxAppears] = useState(false);

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
      <select className={styles.select}>
        <option value="Portugues">Português</option>
        <option value="Ingles">Inglês</option>
      </select>
    </>
  )
}