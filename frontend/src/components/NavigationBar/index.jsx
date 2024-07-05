import styles from './styles.module.css';

import cactusImage from '../../assets/cactus.png';
import logoImage from '../../assets/logo.svg';

import ProgressContext from '../../context/ProgressContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NavigationBarWidth, delayTimeForGetProgress } from '../../settings';
import ProgressBarLoading from '../ProgressBarLoading';
import AuthContext from '../../context/AuthContext';

import { getSelectionProgress } from '../../api/variablesSelection';
import { getTrainingProgress } from '../../api/training';

export default function NavigationBar() {

  const navigate = useNavigate();
  const handleTo = (url, stateToPass) => {
    navigate(url, { state: stateToPass });
  };

  const { authTokens } = useContext(AuthContext);
  const [progressExecutions, setProgressExecutions] = useState([]);

  const getProgress = async() => {
    
    // Verifica se há itens no local storage
    let progressExecutions = []
    if (localStorage.length > 0) {
      console.log('Existe pelo menos um item armazenado no local storage.');
      
      // Listando todas as chaves e valores armazenados
      for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        // Recupera a string JSON do local storage
        const objetoJSONRecuperado = localStorage.getItem(chave)
        // Converte a string JSON de volta para um objeto JavaScript
        const objetoRecuperado = JSON.parse(objetoJSONRecuperado);

        progressExecutions.push(objetoRecuperado);
      }
    } else {
      console.log('Não existe nada armazenado no local storage.');
    }
    setProgressExecutions(progressExecutions);

    // Realiza a busca de progresso nos itens do localStorage
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

        if(progress != maximum) {
          console.log(`Progresso: ${progress}/${maximum}`);
          
          if(progress >= 0) {
            // Atualizar progresso no contexto
            let newExecution = execution;
            execution.progressValue = progress;
            execution.maximumValue = maximum;
            execution.counter = execution.counter + 1;

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
            <div key={index} className={styles.containerProgress}>
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