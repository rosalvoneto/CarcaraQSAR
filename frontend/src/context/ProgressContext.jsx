import { createContext, useContext, useState } from 'react';

import AuthContext from './AuthContext';

import { getProject } from '../api/project';

const ProgressContext = createContext();
export default ProgressContext;


export const ProgressProvider = ({ children }) => {

  const { authTokens } = useContext(AuthContext);
  const [progressExecutions, setProgressExecutions] = useState([]);

  const updateProgressExecutions = (
    projectID, route, actualValue, maximumValue
  ) => {
    // Cria uma cópia do array atual de progressExecutions
    let array = [...progressExecutions];

    // Encontra o índice do objeto que tem o mesmo projectID
    const index = array.findIndex(execution => execution.projectID === projectID);

    if (index !== -1) {
      // Se encontrar, atualiza o objeto existente
      array[index] = { projectID, route, actualValue, maximumValue };
    } else {
      // Se não encontrar, adiciona um novo objeto ao array
      array.push({ projectID, route, actualValue, maximumValue });
    }
    // Atualiza o estado com o novo array
    setProgressExecutions(array);
  }

  const removeProgressExecution = (projectID) => {
    let array = [...progressExecutions];
    const index = array.findIndex(execution => execution.projectID === projectID);
  
    if (index !== -1) {
      array.splice(index, 1);
      setProgressExecutions(array);
    }
  }

  let contextData = {
    progressExecutions: progressExecutions,
    updateProgressExecutions: updateProgressExecutions,
    removeProgressExecution: removeProgressExecution,
  }
  
  return(
    <ProgressContext.Provider value={contextData}>
      { children }
    </ProgressContext.Provider>
  )
}