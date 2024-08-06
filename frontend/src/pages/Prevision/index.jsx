import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';
import Button from '../../components/Button';
import PopUp from '../../components/PopUp';

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
  downloadScaler,
  calculateAll,
  downloadEstimation
} from '../../api/prevision';

import { updateStatus } from '../../api/project';

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

  const [previsionValue, setPrevisionValue] = useState(null);

  const changeVariableValue = (index, value) => {
    let array = variablesValues;
    array[index] = value;
    setVariablesValues(array);
  }

  const hadleToMakePrevision = async () => {
    const response = await makePrevision(
      projectID, variablesValues, authTokens.access
    );
    setPrevisionValue(response.prevision);
  }

  const hadleToCalculateAll = async () => {
    const response = await calculateAll(
      projectID, authTokens.access
    );
  }

  const hadleToCreateModel = async () => {
    const responseCreation = await createModel(
      projectID, authTokens.access
    );

    const response = await getModel(projectID, authTokens.access);
    setHasModel(response.hasModel);
  }

  const hadleToDeleteModel = async () => {
    await deleteModel(
      projectID, authTokens.access
    );

    const response = await getModel(projectID, authTokens.access);
    setHasModel(response.hasModel);
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
      
      let fileName = 'scaler';

      link.setAttribute('download', `${fileName}.pkl`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  } 

  const hadleToDownloadEstimation = async () => {
    const response = await downloadEstimation(
      projectID, authTokens.access
    );

    try {
      // Crie um link temporário e clique nele para iniciar o download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      
      let fileName = 'Estimation.csv';

      link.setAttribute('download', `${fileName}`);
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
      if(response.variables) {
        setVariablesNames(response.variables);
        
        let x = response.variables.length;
        let array = new Array(x).fill(0);
        setVariablesValues(array);
      }
    })

    getModel(projectID, authTokens.access)
    .then(response => {
      setHasModel(response.hasModel);
    })
  }, [])

  useEffect(() => {
    updateStatus(projectID, authTokens.access, 'Prevision');
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
                Make prevision
              </button>
              <button 
                onClick={hadleToDownloadEstimation}
                className={styles.button}
              >
                Make estimation
              </button>
              <button 
                onClick={hadleToDeleteModel}
                className={styles.button}
              >
                Delete model
              </button>
              <button 
                onClick={hadleToDownloadModel}
                className={styles.button}
              >
                Download model
              </button>
              <button 
                onClick={hadleToDownloadScaler}
                className={styles.button}
              >
                Download scaler
              </button>
            </>
          :
            <button 
              onClick={hadleToCreateModel}
              className={styles.button}
            >
              Create model
            </button>
          }
      </div>
      
      {
        previsionValue &&
        <PopUp
          show={true}
          title={"Prevision result"}
          description={previsionValue}
          action={() => {
            setPrevisionValue(null);
          }}
          showButton={true}
          buttonName={'Ok'}
        />
      }

      <Button 
        name={'Back'} 
        URL={'/results'}
        stateToPass={{
          pageNumber: 4
        }}
        side={'left'}
      />
      <Button 
        name={'Finish'} 
        URL={'/home'}
        useStrictURL={true}
        side={'right'}
      />
    </>
  )
}