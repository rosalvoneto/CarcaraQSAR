import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';
import Button from '../../components/Button';

import styles from './styles.module.css';

import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';
import { InlineInput } from '../../components/InlineInput';
import { getVariables } from '../../api/database';
import { 
  makePrevision, 
  createModel, 
  getModel, 
  deleteModel, 
  downloadModel,
  downloadScaler
} from '../../api/prevision';

export default function Prevision() {

  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);
  const { projectID } = useParams();

  const href = '/prevision';
  const progress = 5;
  const subProgress = 0;

  const [variablesNames, setVariablesNames] = useState([]);
  const [variablesValues, setVariablesValues] = useState([]);

  const [hasModel, setHasModel] = useState(false);

  const changeVariableValue = (index, value) => {
    let array = variablesValues;
    array[index] = value;
    setVariablesValues(array);
  }

  const hadleToMakePrevision = async () => {
    const response = await makePrevision(
      projectID, variablesValues, authTokens.access
    );
  }

  const hadleToCreateModel = async () => {
    const response = await createModel(
      projectID, authTokens.access
    );

    getModel(projectID, authTokens.access)
    .then(response => {
      setHasModel(response.hasModel);
    })
  }

  const hadleToDeleteModel = async () => {
    const response = await deleteModel(
      projectID, authTokens.access
    );

    getModel(projectID, authTokens.access)
    .then(response => {
      setHasModel(response.hasModel);
    })
  } 

  const hadleToDownloadModel = async () => {
    const response = await downloadModel(
      projectID, authTokens.access
    );

    try {
      // Crie um link temporário e clique nele para iniciar o download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      
      console.log(response);
      let fileName = 'model';

      link.setAttribute('download', `${fileName}.pkl`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  } 

  const hadleToDownloadScaler = async () => {
    const response = await downloadScaler(
      projectID, authTokens.access
    );

    try {
      // Crie um link temporário e clique nele para iniciar o download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      
      console.log(response);
      let fileName = 'scaler';

      link.setAttribute('download', `${fileName}.pkl`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  } 


  useEffect(() => {
    getVariables(projectID, authTokens.access)
    .then(response => {
      setVariablesNames(response.variables);
      
      let x = response.variables.length;
      let array = new Array(x).fill(0);
      setVariablesValues(array);
    })

    getModel(projectID, authTokens.access)
    .then(response => {
      setHasModel(response.hasModel);
    })
  }, [])

  return(
    <>
      <Header 
        title={projectDetails.name}
      />
      <ProgressBar 
        progressNumber={progress}
        subProgressNumber={subProgress}
      />

      <div className={styles.container}>
        {
          variablesNames.map((variableName, index) => {
            return(
              <InlineInput
                key={index}
                name={variableName}
                type={"number"}
                width={100}
                setValue={(value) => changeVariableValue(index, value)}
              />
            )
          })
        }
      </div>
      <div className={styles.buttonsContainer}>
        {
          hasModel
          ? 
            <>
              <button 
                onClick={hadleToMakePrevision}
                className={styles.button}
              >
                Fazer previsão
              </button>
              <button 
                onClick={hadleToDeleteModel}
                className={styles.button}
              >
                Excluir modelo
              </button>
              <button 
                onClick={hadleToDownloadModel}
                className={styles.button}
              >
                Baixar modelo
              </button>
              <button 
                onClick={hadleToDownloadScaler}
                className={styles.button}
              >
                Baixar Normalizador
              </button>
            </>
          :
            <button 
              onClick={hadleToCreateModel}
              className={styles.button}
            >
              Criar modelo
            </button>
          }
      </div>

      <Button 
        name={'Voltar'} 
        URL={'/results'}
        stateToPass={{
          pageNumber: 4
        }}
        side={'left'}
      />
      <Button 
        name={'Finalizar'} 
        URL={'/home'}
        useStrictURL={true}
        side={'right'}
      />
    </>
  )
}