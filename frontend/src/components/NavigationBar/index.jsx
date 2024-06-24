import styles from './styles.module.css';

import cactusImage from '../../assets/cactus.png';
import logoImage from '../../assets/logo.svg';

import ProgressContext from '../../context/ProgressContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { NavigationBarWidth } from '../../settings';
import ProgressBarLoading from '../ProgressBarLoading';
import AuthContext from '../../context/AuthContext';

import { getSelectionProgress } from '../../api/variablesSelection';
import { getTrainingProgress } from '../../api/training';

export default function NavigationBar() {

  let delayTimeForGetProgress = 5000;

  const navigate = useNavigate();
  const handleTo = (url, stateToPass) => {
    navigate(url, { state: stateToPass });
  };

  const { authTokens } = useContext(AuthContext);
  const { 
    progressExecutions, 
    updateProgressExecutions,
    removeProgressExecution
  } = useContext(ProgressContext);

  const getProgress = async() => {
    progressExecutions.map(async (execution) => {

      let response;
      if(execution.route == 'variables-selection') {
        response = await getSelectionProgress(
          execution.projectID, authTokens.access
        );
        console.log("Progresso de seleção....");
      } else {
        response = await getTrainingProgress(
          execution.projectID, authTokens.access
        );
        console.log("Progresso de treinamento....");
      }

      if(response.progress) {
        const split = response.progress.split('/');
        const progress = Number(split[0]);
        const maximum = Number(split[1]);
        
        if(progress >= 0) {
          // Atualizar progresso no contexto
          updateProgressExecutions(
            execution.projectID,
            execution.route,
            progress,
            maximum,
          )
        }
      } else {
        removeProgressExecution(execution.projectID);
      }

    })
  }

  useEffect(() => {
    // A função será executada a cada quantidade de segundos
    const interval = setInterval(getProgress, delayTimeForGetProgress);
    // Função de limpeza para interromper o intervalo quando 
    // o componente for desmontado
    return () => clearInterval(interval);
  }, []);

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