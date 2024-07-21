import styles from './styles.module.css';

import cactusImage from '../../assets/cactus.png';
import logoImage from '../../assets/logo.svg';

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NavigationBarWidth, delayTimeForGetProgress } from '../../settings';
import ProgressBarLoading from '../ProgressBarLoading';
import AuthContext from '../../context/AuthContext';

import { getSelectionProgress } from '../../api/variablesSelection';
import { getTrainingProgress } from '../../api/training';
import { getProject } from '../../api/project';

export default function NavigationBar() {

  const navigate = useNavigate();
  const handleTo = (url, stateToPass) => {
    navigate(url, { state: stateToPass });
  };

  const { authTokens } = useContext(AuthContext);
  const [progressExecutions, setProgressExecutions] = useState([]);

  const getProjectDetails = async(projectID) => {
    const response = await getProject(projectID, authTokens.access);
    return response.projectData;
  }

  const getProgress = async() => {
    
    // Verifica se há itens no local storage
    let progressExecutions = []
    if (localStorage.length > 0) {
      
      // Listando todas as chaves e valores armazenados
      for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        // Recupera a string JSON do local storage
        const objetoJSONRecuperado = localStorage.getItem(chave)
        // Converte a string JSON de volta para um objeto JavaScript
        const objetoRecuperado = JSON.parse(objetoJSONRecuperado);

        progressExecutions.push(objetoRecuperado);
      }
    }
    setProgressExecutions(progressExecutions);

    // Realiza a busca de progresso nos itens do localStorage
    progressExecutions.map(async (execution) => {
      let response;
      if(execution.route == 'variables-selection') {
        response = await getSelectionProgress(
          execution.projectID, authTokens.access
        );
      } else {
        response = await getTrainingProgress(
          execution.projectID, authTokens.access
        );
      }

      if(response.progress) {
        const split = response.progress.split('/');
        const progress = Number(split[0]);
        const maximum = Number(split[1]);

        if(progress != maximum) {
          
          if(progress >= 0) {
            // Atualizar progresso no contexto
            let newExecution = execution;
            newExecution.progressValue = progress;
            newExecution.maximumValue = maximum;
            newExecution.counter = newExecution.counter + 1;

            const response = await getProjectDetails(execution.projectID);
            newExecution.projectName = response.name;

            // Converte o objeto em uma string JSON
            const executionJSON = JSON.stringify(newExecution);
            
            // Guarda a string JSON no local storage
            localStorage.setItem(
              `progress_${execution.projectID}`,
              executionJSON
            );
          }
        }
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
          All projects
        </a>
        <a className={styles.link}
          onClick={() => handleTo('/shared')}
        >
          Shared projects
        </a>
        <a className={styles.link}
          onClick={() => handleTo('/trash')}
        >
          Deleted projects
        </a>

        <button 
          className={styles.button}
          onClick={() => handleTo('/new')}
        >
          New project
        </button>

        {
          progressExecutions.map((execution, index) => (
            <div key={index} className={styles.progressContainer}>
              <div className={styles.fadeContainer}>
                <p className={styles.fadeText}>
                  Execução: {execution.projectName}
                </p>
              </div>
              <a onClick={
                () => handleTo(`/${execution.projectID}/${execution.route}`,
                { pageNumber: 1 })
              }>
                <ProgressBarLoading
                  progress={execution.progressValue}
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