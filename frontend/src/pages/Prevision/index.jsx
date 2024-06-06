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

export default function Prevision() {

  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);
  const { projectID } = useParams();

  const href = '/prevision';
  const progress = 5;
  const subProgress = 0;

  const [variablesNames, setVariablesNames] = useState([]);
  const [variablesValues, setVariablesValues] = useState([]);

  const changeVariableValue = (index, value) => {
    let array = variablesValues;
    array[index] = value;
    setVariablesValues(array);

    console.log(variablesValues);
  }

  const hadleMakePrevision = () => {
    
  }

  useEffect(() => {
    getVariables(projectID, authTokens.access)
    .then(response => {
      setVariablesNames(response.variables);
      
      let x = response.variables.length;
      let array = new Array(x).fill(0);
      setVariablesValues(array);
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
      <button 
        onClick={hadleMakePrevision}
        className={styles.button}
      >
        Fazer previsão
      </button>

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