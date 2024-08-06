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
  cancelSelection,
  checkSelectionStatus,
  getSelectionProgress,
  setSelectionProgress,
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

import { delayTimeForGetProgress } from '../../settings';

export const algorithms = [
  "Do not apply",
  "Genetic algorithm",
  "Bee colony algorithm",
];

export const algorithmsDescriptions = [
  "No algorithm was chosen",
  "The Genetic Algorithm is an optimization technique based on natural selection and genetics. They operate on populations of candidate solutions and use genetic operators such as mutation and crossover to evolve and improve these solutions over several generations. These algorithms are widely used to find approximate solutions for complex optimization and search problems.",
  "Inspired by the behavior of bee colonies, this algorithm is an optimization technique based on the exploration of candidate solutions in a search space. Virtual bees search for solutions in specific locations and share information about the quality of the solutions found with other bees, allowing convergence to an optimal solution in complex optimization problems.",
];


export const algorithmsParameters = [
  [],
  [
    ['population_quantity', 'Population Quantity', 50, 'Each item in the population is a possible solution to the problem. A possible solution in this case is a set of variables in which only a subset of them is active for the creation of the model. Thus, this parameter defines how many variations of sets of variables we will have in each generation of the algorithm execution.'],
    ['info_gain_quantity', 'Initial Variable Quantity', 50, 'Number of variables that will be active at the beginning of the algorithm.'],
    ["probability_crossover", "Crossover Probability", 0.6, 'Probability that two individuals selected for reproduction will exchange parts of their solutions to create new individuals (or offspring).'],
    ['probability_mutation', 'Mutation Probability', 0.01, 'Probability that small random changes will be made to the individuals in the population.'],
    ['limit_generations', 'Generation Limit', 500, 'Maximum number of reproduction and selection cycles that the algorithm will execute.'],
    ['limit_not_improvement', 'No Improvement Limit', 500, 'Maximum number of consecutive iterations that the algorithm can execute without finding a better solution.'],
    ['r2_condition_BFS', 'BFS Q2 Limit', 0.99, 'Q2 is the cross-validation evaluation metric. The closer to the value 1, the better the selected set of variables. This parameter defines the ideal Q2 value for the algorithm to stop its execution.'],
    ['limit_not_improvement_BFS', 'No Improvement BFS Limit', 30, 'Limit of times the algorithm cycle will run without improvement in the Q2 value.'],
    ['n_child_positions', 'Number of Variables to Add in BFS', 1, 'Defines how many variables should be added in each cycle.'],
    ['children_quantity', 'Number of Offspring Generated from Parent Node in BFS', 2, 'Defines the number of variations of sets of variables that are added in each interaction for analysis.'],
  ],
  [
    ["maximum_iterations", "Iteration Limit", 500, 'Maximum number of times the algorithm will execute its solution search cycle.'],
    ["bees", "Number of Bees", 50, 'Number of bees (or agents) that will search for solutions within the search space.'],
    ["limit_not_improvement", "No Improvement Limit", 50, 'Maximum number of consecutive iterations that the algorithm can execute without finding a better solution for the evaluated parameter (Q2).'],
    ["info_gain_quantity", "Initial Variable Quantity", 50, 'Number of variables that will be active at the beginning of the algorithm.'],
    ['r2_condition_BFS', 'BFS Q2 Limit', 0.99, 'Q2 is the cross-validation evaluation metric. The closer to the value 1, the better the selected set of variables. This parameter defines the ideal Q2 value for the algorithm to stop its execution.'],
    ['limit_not_improvement_BFS', 'No Improvement BFS Limit', 30, 'Limit of times the algorithm cycle will run without improvement in the Q2 value.'],
    ['n_child_positions', 'Number of Variables to Add in BFS', 1, 'Defines how many variables should be added in each cycle.'],
    ['children_quantity', 'Number of Offspring Generated from Parent Node in BFS', 2, 'Defines the number of variations of sets of variables that are added in each interaction for analysis.'],
  ]
];


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
  const [actualStep, setActualStep] = useState(0);
  const [totalStep, setTotalStep] = useState(0);
  const [timeForEstimation, setTimeForEstimation] = useState(0);

  const [executionType, setExecutionType] = useState("");
  const [useGetProgress, setUseGetProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setUseGetProgress(true);
    await makeSelection(projectID, authTokens.access);
  }

  const handleToCancelSelection = async() => {
    const response = await cancelSelection(projectID, authTokens.access);
    console.log(response);
    
    setSelected("false");
    setUseGetProgress(false);
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
    const currentProgress = progress;
    const timeForCurrentProgress = counterInProgress * delayTimeForGetProgress;
    const remainingProgress = (maximum - progress);
    
    const timeForRemainingProgress = (remainingProgress * timeForCurrentProgress) / currentProgress;
    // Transforma em segundos
    let estimation = timeForRemainingProgress / 1000;
    // Transforma em minutos
    estimation = estimation / 60;
    
    setTimeForEstimation(Math.ceil(estimation));
  }

  const getProgress = async() => {
    console.log("VARIABLES SELECTION");

    // Realiza a busca do status da tarefa
    const responseTask = await checkSelectionStatus(
      projectID, authTokens.access
    );
    console.log(responseTask);

    if(responseTask.state == 'SUCCESS') {
      setUseGetProgress(false);
      // Atualizar progresso
      setProgressValue(100);
      setMaximumValue(100);
      setTimeout(() => {
        alert("Process finished!");
        setSelected("finished");
      }, 2000);
      localStorage.removeItem(`progress_${projectID}`);
    } else if(responseTask.state == 'FAILURE' || responseTask.state == 'ERROR') {
      setUseGetProgress(false);
      setSelected("error");
      
      const { error } = responseTask.result;
      setErrorMessage(error);

      alert("An error has occurred!");
      localStorage.removeItem(`progress_${projectID}`);
    }

    // Realiza a busca de progresso da tarefa
    const response = await getSelectionProgress(projectID, authTokens.access);
    console.log(response);

    if(response.progress) {
      const split = response.progress.split('/');
      const progress = Number(split[0]);
      const maximum = Number(split[1]);
      const actualStep = Number(split[2]);
      const totalStep = Number(split[3]);
      
      if(progress >= 0) {
        // Atualizar progresso no estado local
        setProgressValue(progress);
        setMaximumValue(maximum);
        setActualStep(actualStep);
        setTotalStep(totalStep);

        setExecutionType(response.executionType);

        // Atualizar progresso no localStorage
        const executionString = localStorage.getItem(`progress_${projectID}`);
        let execution = {};
        if(executionString) {
          execution = JSON.parse(executionString);
          if(progress < execution.progressValue) {
            execution.counter = 0;
          }
          execution.progressValue = progress;
          execution.maximumValue = maximum;
        } else {
          execution = {
            projectID: projectID,
            route: 'variables-selection',
            progressValue: progress,
            maximumValue: maximum,
            counter: 0,
          };
        }
        const executionJSON = JSON.stringify(execution);
        localStorage.setItem(
          `progress_${projectID}`,
          executionJSON
        );
        
        // Faz a estimativa de finalização
        makeEstimation(
          execution.counter, progress, maximum
        );
        console.log(timeForEstimation);
      }
    }
  }

  useEffect(() => {
    if(useGetProgress) {
      // A função será executada a cada quantidade de segundos
      const interval = setInterval(getProgress, delayTimeForGetProgress);
      // Função de limpeza para interromper o intervalo quando 
      // o componente for desmontado
      return () => clearInterval(interval);
    }
  }, [selected]);

  useEffect(() => {
    getVariablesSettings(projectID, authTokens.access)
    .then(response => {
      setRemoveConstantVariables(response.removeConstantVariables);

      setRightListOfVariables(response.variablesToRemove);

      setChoosenAlgorithm(response.algorithm);
      
      if(Object.keys(response.algorithmParameters).length) {
        setAlgorithmParameters(response.algorithmParameters);
      } else {
        // Inicializar o objeto resultante
        let resultObject = {};

        // Iterar sobre cada sub-array em algorithmsParameters
        algorithmsParameters.forEach(sublist => {
          sublist.forEach(item => {
            const key = item[0];
            const value = item[2];
            resultObject[key] = value;
          });
        });

        // Exibir o objeto resultante
        setAlgorithmParameters(resultObject);
      }
      
      setRowsToRemove(response.rowsToRemove.toString());

      if(response.algorithmProgress) {
        setSelected('hide progress');
        setUseGetProgress(true);
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
    updateStatus(projectID, authTokens.access, 'Variables selection');
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
            name={"Automatically remove constant variables"}
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
                name={"Bioinspired Algorithm"}
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
                          key={`${algorithmIndex}-${index}`}
                          name={key[1]} 
                          type={'number'}
                          setValue={(value) => changeParameters(key[0], value)}
                          value={
                            algorithmParameters[key[0]] 
                            ? algorithmParameters[key[0]] 
                            : algorithmsParameters[algorithmIndex][index][2]
                          }
                        />
                      )
                    })
                  :
                    undefined
                }
              </div>
              {
                algorithmIndex != 0 &&
                (
                  selected == "false"
                  ?
                    <button 
                      onClick={handleToMakeSelection}
                      className={styles.button}
                    >
                      Save and select
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

            <div className={styles.informationContainer}>
              <p className={styles.information}>
                { algorithmsDescriptions[algorithmIndex] }
              </p>
              {
                algorithmsParameters[algorithmIndex].map((parameter, index) => {
                  return(
                    <p key={index} className={styles.information}>
                      {`${parameter[1]}: ${parameter[3]}`}
                    </p>
                  )
                })
              }
            </div>
          </div>

          {
            selected == "first time" &&
            <PopUp 
              show={true}
              title={"Selection in progress..."}
              description={
                `The selection with '${choosenAlgorithm}' is running!`
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
                setSelected("hide progress")
              }}

              showSecondButton
              secondButtonName={"Cancel"}
              secondAction={handleToCancelSelection}
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
                    executionType.length
                    ? `Process ${actualStep}/${totalStep}: ${executionType}`
                    : undefined
                  }
                </p>
                <p>
                  {
                    timeForEstimation >= 0 &&
                    `Completion estimate: ${(timeForEstimation).toFixed(0)} minutes`
                  }
                </p>
              </div>
            </PopUp>
          }

          {
            selected == "error" &&
            <PopUp 
              show={true}
              title={"Selection problem"}
              description={
                <>
                  <p>
                    An internal server error prevented the selection from being completed.
                  </p>
                  <p>
                    {errorMessage}
                  </p>
                </>
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
              title={"Finalized selection"}
              description={
                `The selection has been finalized! Click the button below to proceed!`
              }

              showButton
              buttonName={"Ok"}
              action={navigateToVariablesSelection}
            />
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
                    <div key={index}>
                      <p className={styles.name}>
                        <strong>{dbInformation.description}</strong>
                      </p>
                      <div className={styles.historyBlock}>
                        <p>Name: {dbInformation.name}</p>
                        <p>Date: {dbInformation.created_at}</p>
                        <p>{dbInformation.lines} rows e {dbInformation.columns} columns</p>
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
                    </div>
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