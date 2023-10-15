import styles from './styles.module.css';

import cactusImage from '../../assets/cactus.png';
import logoImage from '../../assets/logo.svg';

export default function NavigationBar() {
  return(
    <div className={styles.container}>
      <img src={logoImage} alt="logo" className={styles.logoImage} />

      <div className={styles.linksContainer}>
        <a className={styles.link}>Todos os projetos</a>
        <a className={styles.link}>Compartilhados</a>
        <a className={styles.link}>Projetos excluídos</a>
        <a className={styles.link}>Modelos disponíveis</a>

        <button className={styles.button}>
          Novo projeto
        </button>
      </div>

      <img 
        className={styles.cactusImage} 
        src={cactusImage} 
        alt="cactus" 
      />
    </div>
  )
}