import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CaretRight, CaretLeft } from '@phosphor-icons/react';

import styles from './styles.module.css';

import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';
import { RadionInput } from '../../components/RadioInput';
import Button from '../../components/Button';
import { Selector } from '../../components/Selector';
import { Option } from '../../components/Selector/Option';

import { 
  getVariablesSettings, 
  setVariablesSettings, 
  removeDatabaseRows,
  removeDatabaseConstantVariables, 
  removeDatabaseVariables,
  makeSelection,
  getSelectionProgress,
  setSelectionProgress
} 
from '../../api/variablesSelection';
import { deleteDatabase, downloadDatabase, getDatabases } from '../../api/database';

import { updateStatus } from '../../api/project';

import { DownloadSimple, TrashSimple } from '@phosphor-icons/react';

import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';
import { InlineInput } from '../../components/InlineInput';
import PopUp from '../../components/PopUp';
import Loading from '../../components/Loading';
import ProgressBarLoading from '../../components/ProgressBarLoading';
import ProgressContext from '../../context/ProgressContext';

import { delayTimeForGetProgress } from '../../settings';

export const algorithms = [
  "DO NOT USE",
  "Genetic Algorithm",
  "Bee Colony",
];

export const algorithmsDescriptions = [
  "No algorithm was chosen",
  "Genetic Algorithms are an optimization technique based on natural selection and genetics. They operate on populations of candidate solutions and use genetic operators, such as mutation and crossover, to evolve and improve these solutions over several generations. These algorithms are widely used to find approximate solutions for complex optimization and search problems.",
  "Inspired by the behavior of bee colonies, the Bee Colony Algorithm is an optimization technique based on the exploration of candidate solutions in a search space. Virtual bees search for solutions in specific locations and share information about the quality of the solutions found with other bees, allowing convergence to an optimal solution in complex optimization problems.",
];


export const algorithmsParameters = [
  [],
  [
    ['population_quantity', 'Population quantity'],
    ['info_gain_quantity', 'Initial variable quantity'],
    ["probability_crossover", "Crossover probability"],
    ['probability_mutation', 'Mutation probability'],
    ['limit_generations', 'Generation limit'],
    ['limit_not_improvement', 'No improvement limit'],
    ['r2_condition_BFS', 'R2 limit for BFS'],
    ['limit_not_improvement_BFS', 'No improvement limit for BFS'],
    ['n_child_positions', 'Number of variables to add in BFS'],
    ['children_quantity', 'Number of children generated from parent node in BFS'],
  ],
  [
    ["maximum_iterations", "Iteration limit"],
    ["bees", "Number of bees"],
    ["limit_not_improvement", "No improvement limit"],
    ["info_gain_quantity", "Initial variable quantity"],
    ['r2_condition_BFS', 'R2 limit for BFS'],
    ['limit_not_improvement_BFS', 'No improvement limit for BFS'],
    ['n_child_positions', 'Number of variables to add in BFS'],
    ['children_quantity', 'Number of children generated from parent node in BFS'],
  ]
]

export const optionsToRemoveVariables = ["Yes", "No"];

export default function VariablesSelection() {

  const href = '/variables-selection';
  const progress = 2;

  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);
  const { projectID } = useParams();

  const location = useLocation();
  const state = location.state;

  const [algorithmIndex, setAlgorithmIndex] = useState(0);

  let pageNumber = 0;
  if(state) {
    if(state.pageNumber) {
      pageNumber = state.pageNumber;
    }
  }

  const [choosenAlgorithm, setChoosenAlgorithm] = useState();
  const [algorithmParameters, setAlgorithmParameters] = useState({});

  const [removeConstantVariables, setRemoveConstantVariables] = useState();

  const [rightListOfVariables, setRightListOfVariables] = useState([]);
  const [temporaryListToRemove, setTemporaryListToRemove] = useState([]);
  const [temporaryListToAdd, setTemporaryListToAdd] = useState([]);

  const [rowsToRemove, setRowsToRemove] = useState("");

  const [selected, setSelected] = useState("false");

  const [databases, setDatabases] = useState([]);

  const [progressValue, setProgressValue] = useState(0);
  const [maximumValue, setMaximumValue] = useState(100);
  const [timeForEstimation, setTimeForEstimation] = useState(0);
  const [counterInProgress, setCounterInProgress] = useState(0);

  const navigate = useNavigate();
  const navigateToVariablesSelection = () => {
    navigate(
      `/${projectID}/variables-selection`,
      {
        state: {
          pageNumber: 2
        }
      }
    );
  }

  const handleChangeRemoveConstantVariables = (value) => {
    if(value === optionsToRemoveVariables[0]) {
      setRemoveConstantVariables(true);
    } else {
      setRemoveConstantVariables(false);
    }
  }

  const setValuesToTheListToRemove = (variableName, variableValue) => {
    if(variableValue) {
      // Adicionar a lista
      if (!temporaryListToRemove.includes(variableName)) {
        setTemporaryListToRemove(
          [...temporaryListToRemove, variableName]
        )
      }
    } else {
      // Remover da lista
      let newlist = temporaryListToRemove.filter(
        item => item !== variableName
      );
      setTemporaryListToRemove(newlist);
    }
  }

  const removeVariablesOfTheList = (variablesToRemove) => {
    let newListOfVariables = rightListOfVariables.filter(variable => 
      !variablesToRemove.includes(variable)
    )
    setRightListOfVariables(newListOfVariables);
  }

  const addVariablesToTheList = (variablesToAdd) => {
    let newListOfVariables = [...rightListOfVariables];
    variablesToAdd.forEach(variableToAdd => {
      if(!rightListOfVariables.includes(variableToAdd)) {
        newListOfVariables.push(variableToAdd);
      }
    });
    setRightListOfVariables(newListOfVariables);
    
  }

  const changeParameters = (key, value) => {
    let values = algorithmParameters;
    values[key] = value;
    setAlgorithmParameters(values);
  }

  const handleToChangeVariables = async() => {
    await setVariablesSettings(
      projectID,
      removeConstantVariables,
      rightListOfVariables,
      choosenAlgorithm,
      algorithmParameters,
      rowsToRemove,
      authTokens.access
    );
    await removeDatabaseConstantVariables(projectID, authTokens.access);
    await removeDatabaseVariables(projectID, authTokens.access);
  }

  const handleToMakeSelection = async() => {
    await setVariablesSettings(
      projectID,
      removeConstantVariables,
      rightListOfVariables,
      choosenAlgorithm,
      algorithmParameters,
      rowsToRemove,
      authTokens.access
    );

    setSelected("first time");
    const response = await makeSelection(projectID, authTokens.access);

    if(response.status == 500) {
      setSelected("error");
      alert("Ocorreu um erro!");
    } else {
      setSelected("finished");
      alert("Finalizou!");
    }
    localStorage.removeItem(`progress_${projectID}`);
  }

  const handleToChangeRows = async() => {
    await setVariablesSettings(
      projectID,
      removeConstantVariables,
      rightListOfVariables,
      choosenAlgorithm,
      algorithmParameters,
      rowsToRemove,
      authTokens.access
    );
    await removeDatabaseRows(projectID, authTokens.access);

    getDatabases(projectID, authTokens.access)
    .then((response) => {
      setDatabases(response.databases);
    })
  }

  // Fazer download automático do CSV que vem do Backend
  const handleDownload = async (databaseIndex) => {

    const response = await downloadDatabase(
      projectID, 
      databaseIndex,
      authTokens.access
    );

    try {
      // Crie um link temporário e clique nele para iniciar o download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;

      // Exemplo de uma string contendo o nome do arquivo com várias extensões
      let fileName = databases[databaseIndex].name;

      // Encontrar a última ocorrência do ponto na string
      let lastIndex = fileName.lastIndexOf('.');

      // Extrair a parte da string até o último ponto
      let newFileName = fileName.substring(0, lastIndex);

      link.setAttribute('download', `${newFileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  // Deletar o Database associado do backend
  const handleDelete = async (databaseIndex) => {

    await deleteDatabase(
      projectID, 
      databaseIndex,
      authTokens.access
    );

    const response = await getDatabases(projectID, authTokens.access)
    setDatabases(response.databases);
  }

  const makeEstimation = (counterInProgress, progress, maximum) => {
    const progressAtual = progress;
    const timeForProgressAtual = counterInProgress * delayTimeForGetProgress;
    const progressRestante = (maximum - progress);
    
    const timeForProgressRestante = (progressRestante * timeForProgressAtual) / progressAtual;
    // Transforma em segundos
    let estimation = timeForProgressRestante / 1000;
    // Transforma em minutos
    estimation = estimation / 60;
    
    setTimeForEstimation(Math.ceil(estimation));
  }

  const getProgress = async() => {
    const response = await getSelectionProgress(projectID, authTokens.access);
    if(response.progress) {
      const split = response.progress.split('/');
      const progress = Number(split[0]);
      const maximum = Number(split[1]);
      
      if(progress >= 0) {
        // Atualizar progresso
        setProgressValue(progress);
        setMaximumValue(maximum);

        // Atualizar progresso no localStorage
        const executionString = localStorage.getItem(`progress_${projectID}`);
        let execution = {};
        if(executionString) {
          execution = JSON.parse(executionString);
          if(progress < execution.progressValue) {
            execution.counter = 0;
          }
        } else {
          execution = {
            projectID: projectID,
            route: 'variables-selection',
            progressValue: progress,
            maximumValue: maximum,
            counter: 0
          };
        }
        
        // Converte o objeto em uma string JSON
        const executionJSON = JSON.stringify(execution);
        
        // Guarda a string JSON no local storage
        localStorage.setItem(
          `progress_${projectID}`,
          executionJSON
        );

        makeEstimation(
          execution.counter, progress, maximum
        );
      }
    }
  }

  useEffect(() => {
    // A função será executada a cada quantidade de segundos
    const interval = setInterval(getProgress, delayTimeForGetProgress);
    // Função de limpeza para interromper o intervalo quando 
    // o componente for desmontado
    return () => clearInterval(interval);
  }, [selected]);

  useEffect(() => {
    getVariablesSettings(projectID, authTokens.access)
    .then(response => {
      setRemoveConstantVariables(response.removeConstantVariables);

      setRightListOfVariables(response.variablesToRemove);

      setChoosenAlgorithm(response.algorithm);
      
      if(response.algorithmParameters) {
        setAlgorithmParameters(response.algorithmParameters);
      }
      
      setRowsToRemove(response.rowsToRemove.toString());

      if(response.algorithmProgress) {
        const split = response.algorithmProgress.split('/');
        setProgressValue(Number(split[0]));
        setMaximumValue(Number(split[1]));

        setSelected("hide progress");
      }
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  useEffect(() => {
    const index = algorithms.indexOf(choosenAlgorithm);
    if(index == -1) {
      setAlgorithmIndex(0);
    } else {
      setAlgorithmIndex(index);
    }
  }, [choosenAlgorithm]);    

  useEffect(() => {
    if(pageNumber == 3) {
      getDatabases(projectID, authTokens.access)
      .then((response) => {
        setDatabases(response.databases);
      })
    }
  }, [pageNumber])

  useEffect(() => {
    updateStatus(projectID, authTokens.access, 'Seleção de variáveis');
  }, [])

  if(pageNumber == 0) {
    return(
      <>
        <Header 
          title={projectDetails.name}
        />
        <ProgressBar 
          progressNumber={progress}
          subProgressNumber={pageNumber}
        />

        <div className={styles.container}>
          <RadionInput 
            name={"Remove constant variables"}
            options={optionsToRemoveVariables}
            setOption={handleChangeRemoveConstantVariables}
            firstOption={
              removeConstantVariables
              ? optionsToRemoveVariables[0]
              : optionsToRemoveVariables[1]
            }
          />

          <p className={styles.name}>
            <strong>{"Remove variables manually"}</strong>
          </p>

          <div className={styles.inputContainer}>
            
          </div>

          <div className={styles.containerContainer}>
            <div className={styles.selectorContainer}>
              <Selector 
                rightListOfVariables={rightListOfVariables}
                setRightListOfVariables={setRightListOfVariables}

                setTemporaryListToAdd={setTemporaryListToAdd}
                temporaryListToAdd={temporaryListToAdd}
              />
            </div>
            <div className={styles.buttonsContainer}>
              <a 
                className={styles.button}
                onClick={() => addVariablesToTheList(temporaryListToAdd)}
              >
                <CaretRight size={23}/>
              </a>
              <a 
                className={styles.button}
                onClick={() => removeVariablesOfTheList(temporaryListToRemove)}
              >
                <CaretLeft size={23}/>
              </a>
            </div>
            <div className={styles.selectedVariablesContainer}>
              {
                rightListOfVariables.map((variableName, index) => {
                  
                  return(
                    <Option 
                      key={index}
                      name={variableName}
                      onChangeState={setValuesToTheListToRemove}
                    />
                  )
                })
              }
            </div>
          </div>
        </div>
        
        <Button 
          name={'Back'} 
          URL={`/pre-processing`}
          stateToPass={{
            pageNumber: 1
          }}
          side={'left'}
        />
        <Button 
          name={'Next'} 
          URL={`/variables-selection`} 
          stateToPass={{
            pageNumber: 1
          }}
          side={'right'}
          action={handleToChangeVariables}
        />
      </>
    )
  } else if(pageNumber == 1) {
    return(
      <>
        <Header 
          title={projectDetails.name}
        />
        <ProgressBar 
          progressNumber={progress}
          subProgressNumber={pageNumber}
        />

        <div className={styles.container}>
          <div className={styles.algorithmContainer}>
            <div>
              <RadionInput 
                name={"Bioinspired algorithm"}
                options={algorithms}
                setOption={setChoosenAlgorithm}
                firstOption={choosenAlgorithm}
              />

              <div className={styles.parametersContainer}>
                {
                  true
                  ?
                    algorithmsParameters[
                      algorithmIndex
                    ].map((key, index) => {
                      return(
                        <InlineInput 
                          key={index}
                          name={key[1]} 
                          type={'number'}
                          setValue={(value) => changeParameters(key[0], value)}
                          value={
                            algorithmParameters[key[0]] 
                            ? algorithmParameters[key[0]] 
                            : 0
                          }
                        />
                      )
                    })
                  :
                    undefined
                }
              </div>
            </div>

            <div className={styles.informationContainer}>
              <p className={styles.information}>
                { algorithmsDescriptions[algorithmIndex] }
              </p>
              {
                /* 
                <ProgressBarLoading 
                  progress={0}
                  maximum={100}
                /> 
                */
              }
            </div>
          </div>

          {
            selected == "first time" &&
            <PopUp 
              show={true}
              title={"Selection in progress..."}
              description={
                `The selection with the ${choosenAlgorithm} algorithm is being executed!`
              }

              showButton
              buttonName={"Ok"}
              action={() => {
                setSelected("show progress");
              }}
            />
          }
          
          {
            selected == "show progress" &&
            <PopUp 
              show={true}
              title={"Selecting..."}

              showButton
              buttonName={"Close"}
              action={() => {
                setSelected("hide progress");
              }}
            >
              <Loading size={45} />
              <div className={styles.progressContainer}>
                <ProgressBarLoading 
                  progress={progressValue}
                  maximum={maximumValue}
                />
                <p>
                  {
                  `${(progressValue / maximumValue * 100).toFixed(0)}%`
                  }
                </p>
                <p>
                  {
                    timeForEstimation >= 0 &&
                    `Estimation: ${(timeForEstimation).toFixed(0)} minutes`
                  }
                </p>
              </div>
            </PopUp>
          }

          {
            selected == "error" &&
            <PopUp 
              show={true}
              title={"Error"}
              description={
                `An internal server error prevented the selection from being completed.`
              }

              showButton
              buttonName={"Close"}
              action={() => {
                setSelected("false");
              }}
            />
          }

          {
            selected == "finished" &&
            <PopUp 
              show={true}
              title={"Selection completed"}
              description={
                `Selection completed.`
              }

              showButton
              buttonName={"Ok"}
              action={navigateToVariablesSelection}
            />
          }


          {
            algorithmIndex != 0 &&
            (
              selected == "false"
              ?
                <button 
                  onClick={handleToMakeSelection}
                  className={styles.button}
                >
                  Save and Select
                </button>
              :
                <button 
                  onClick={() => {
                    setSelected("show progress");
                  }}
                  className={styles.button}
                >
                  Show progress
                </button>
              
            )
          }

        </div>
        
        <Button
          name={'Back'} 
          URL={`/variables-selection`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'left'}
        />
        {
          algorithmIndex == 0 &&
          <Button 
            name={'Next'} 
            URL={`/variables-selection`} 
            stateToPass={{
              pageNumber: 2
            }}
            side={'right'}
          />
        }
      </>
    )
  } else if(pageNumber == 2) {
    return(
      <>
        <Header 
          title={projectDetails.name}
        />
        <ProgressBar 
          progressNumber={progress}
          subProgressNumber={pageNumber}
        />

        <div className={styles.container}>
          <InlineInput 
            name={"Rows to remove:"}
            width={"80%"}
            setValue={setRowsToRemove}
            value={rowsToRemove}
          />
        </div>
        
        <Button 
          name={'Back'} 
          URL={`/variables-selection`}
          stateToPass={{
            pageNumber: 1
          }}
          side={'left'}
        />
        <Button 
          name={'Next'} 
          URL={`/variables-selection`} 
          stateToPass={{
            pageNumber: 3
          }}
          side={'right'}
          action={handleToChangeRows}
        />
      </>
    )
  } else if(pageNumber == 3) {
    return(
      <>
        <Header 
          title={projectDetails.name}
        />
        <ProgressBar 
          progressNumber={progress}
          subProgressNumber={pageNumber}
        />

        <div className={styles.container}>

            <div className={styles.contentContainer}>
              {
                databases.map((dbInformation, index) => {
                  return(
                    <>
                      <p className={styles.name}>
                        <strong>{dbInformation.description}</strong>
                      </p>
                      <div className={styles.historyBlock}>
                        <p>Name: {dbInformation.name}</p>
                        <p>Date: {dbInformation.created_at}</p>
                        <p>{dbInformation.lines} rows and {dbInformation.columns} columns</p>
                      </div>
                      <a
                        onClick={() => {
                          handleDownload(index);
                        }}
                      >
                        <DownloadSimple size={30} color='var(--black-color-1)' />
                      </a>
                      <a
                        onClick={() => {
                          handleDelete(index);
                        }}
                      >
                        <TrashSimple size={27} color='var(--black-color-1)' />
                      </a>
                    </>
                  )
                })
              }
              
            </div>

        </div>
        
        <Button 
          name={'Back'} 
          URL={`/variables-selection`}
          stateToPass={{
            pageNumber: 2
          }}
          side={'left'}
        />
        <Button 
          name={'Next'} 
          URL={`/training`} 
          stateToPass={{
            pageNumber: 0
          }}
          side={'right'}
        />
      </>
    )
  }
}