import styles from './styles.module.css';

import cactusImage from '../../assets/cactus.png';
import logoImage from '../../assets/logo.svg';

import ProgressContext from '../../context/ProgressContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { NavigationBarWidth } from '../../settings';
import ProgressBarLoading from '../ProgressBarLoading';

export default function NavigationBar() {

  const navigate = useNavigate();
  const handleTo = (url, stateToPass) => {
    navigate(url, { state: stateToPass });
  };

  const { progressExecutions } = useContext(ProgressContext);

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
          onClick={() => handleTo('/shared')}
        >
          Compartilhados
        </a>
        <a className={styles.link}
          onClick={() => handleTo('/trash')}
        >
          Projetos excluídos
        </a>

        <button 
          className={styles.button}
          onClick={() => handleTo('/new')}
        >
          Novo projeto
        </button>

        {
          progressExecutions.map((execution, index) => (
            <div className={styles.containerProgress}>
              <a onClick={
                () => handleTo(`/${execution.projectID}/${execution.route}`,
                { pageNumber: 1 })
              }>
                <ProgressBarLoading
                  progress={execution.actualValue}
                  maximum={execution.maximumValue}
                />
              </a>

            </div>
          ))
        }


      </div>

      <img 
        className={styles.cactusImage} 
        src={cactusImage} 
        alt="cactus" 
      />
    </div>
  )
}