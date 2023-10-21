import styles from './styles.module.css';

import cactusImage from '../../assets/cactus.png';
import logoImage from '../../assets/logo.svg';

import { useNavigate } from 'react-router-dom';

import { NavigationBarWidth } from '../../settings';

export default function NavigationBar() {

  const navigate = useNavigate();

  const handleTo = (url) => {
    navigate(url);
  };

  return(
    <div 
      className={styles.container}
      style={{ width: NavigationBarWidth }}
    >
      <img src={logoImage} alt="logo" className={styles.logoImage} />

      <div className={styles.linksContainer}>
        <a className={styles.link}
          onClick={() => handleTo('/home')}
        >
          Todos os projetos
        </a>
        <a className={styles.link}
          onClick={() => handleTo('/home')}
        >
          Compartilhados
        </a>
        <a className={styles.link}
          onClick={() => handleTo('/home')}
        >
          Projetos escolhidos
        </a>
        <a className={styles.link}
          onClick={() => handleTo('/home')}
        >
          Modelos disponíveis
        </a>

        <button 
          className={styles.button}
          onClick={() => handleTo('/new')}
        >
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