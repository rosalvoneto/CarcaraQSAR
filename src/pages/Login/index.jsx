import AuntenticBox from "../../components/AutenticBox";
import Logo from "./Logo";

import styles from './styles.module.css';

export function Login() {
  return(
    <div className={styles.container}>
      <Logo />
      <AuntenticBox />
    </div>
  )
}