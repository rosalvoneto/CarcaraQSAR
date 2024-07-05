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
  "NÃO APLICAR",
  "Algoritmo genético",
  "Colônia de abelhas",
];

export const algorithmsDescriptions = [
  "Nenhum algoritmo foi escolhido",
  "Os Algoritmos Genéticos são uma técnica de otimização baseada na seleção natural e genética. Eles operam em populações de soluções candidatas e utilizam operadores genéticos, como mutação e cruzamento, para evoluir e melhorar essas soluções ao longo de várias gerações. Esses algoritmos são amplamente usados para encontrar soluções aproximadas para problemas complexos de otimização e busca.",
  "Inspirado no comportamento de colônias de abelhas, o Algoritmo de Colônia de Abelhas é uma técnica de otimização baseada na exploração de soluções candidatas em um espaço de busca. Abelhas virtuais procuram soluções em locais específicos e compartilham informações sobre a qualidade das soluções encontradas com outras abelhas, permitindo a convergência para uma solução ótima em problemas de otimização complexos.",
]

export const algorithmsParameters = [
  [],
  [
    ['population_quantity', 'Quantidade da população'],
    ['info_gain_quantity', 'Quantidade de variáveis iniciais'],
    ["probability_crossover", "Probabilidade de crossover"],
    ['probability_mutation', 'Probabilidade de mutação'],
    ['limit_generations', 'Limite de gerações'],
    ['limit_not_improvement', 'Limite sem melhoria'],
    ['r2_condition_BFS', 'Limite R2 do BFS'],
    ['limit_not_improvement_BFS', 'Limite sem melhoria do BFS'],
    ['n_child_positions', 'Número de variáveis para adicionar no BFS'],
    ['children_quantity', 'Número de filhos gerados a partir do nó pai no BFS'],
  ],
  [
    ["maximum_iterations", "Limite de interações"],
    ["bees", "Quantidade de abelhas"],
    ["limit_not_improvement", "Limite sem melhoria"],
    ["info_gain_quantity", "Quantidade de variáveis iniciais"],
    ['r2_condition_BFS', 'Limite R2 do BFS'],
    ['limit_not_improvement_BFS', 'Limite sem melhoria do BFS'],
    ['n_child_positions', 'Número de variáveis para adicionar no BFS'],
    ['children_quantity', 'Número de filhos gerados a partir do nó pai no BFS'],
  ]
]

export const optionsToRemoveVariables = ["Sim", "Não"];

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
    console.log("Variáveis para retirar:", variablesToRemove);

    let newListOfVariables = rightListOfVariables.filter(variable => 
      !variablesToRemove.includes(variable)
    )
    setRightListOfVariables(newListOfVariables);
  }

  const addVariablesToTheList = (variablesToAdd) => {
    console.log("Variáveis para adicionar:", variablesToAdd);

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

    console.log(values);
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
    console.log("Seleção de variáveis finalizada!");

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
      console.log(response.databases);
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
    console.log(response.databases);
    setDatabases(response.databases);
  }

  const makeEstimation = (counterInProgress, progress, maximum) => {
    const progressAtual = progress;
    const timeForProgressAtual = counterInProgress * delayTimeForGetProgress;
    const progressRestante = (maximum - progress);
    
    console.log("Fazendo estimativa...");
    
    const timeForProgressRestante = (progressRestante * timeForProgressAtual) / progressAtual;
    // Transforma em segundos
    let estimation = timeForProgressRestante / 1000;
    // Transforma em minutos
    estimation = estimation / 60;
    console.log(estimation, "minutos...");
    
    setTimeForEstimation(Math.ceil(estimation));
  }

  const getProgress = async() => {
    const response = await getSelectionProgress(projectID, authTokens.access);
    if(response.progress) {
      console.log(response.progress);
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
      console.log(response.removeConstantVariables);
      setRemoveConstantVariables(response.removeConstantVariables);

      console.log(response.variablesToRemove);
      setRightListOfVariables(response.variablesToRemove);

      console.log(response.algorithm);
      setChoosenAlgorithm(response.algorithm);
      
      if(response.algorithmParameters) {
        console.log(response.algorithmParameters);
        setAlgorithmParameters(response.algorithmParameters);
      }
      
      console.log(response.rowsToRemove);
      setRowsToRemove(response.rowsToRemove.toString());

      if(response.algorithmProgress) {
        console.log(response.algorithmProgress);
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
        console.log(response.databases);
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
            name={"Remover automaticamente variáveis constantes"}
            options={optionsToRemoveVariables}
            setOption={handleChangeRemoveConstantVariables}
            firstOption={
              removeConstantVariables
              ? optionsToRemoveVariables[0]
              : optionsToRemoveVariables[1]
            }
          />

          <p className={styles.name}>
            <strong>{"Remover variáveis manualmente"}</strong>
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
          name={'Voltar'} 
          URL={`/pre-processing`}
          stateToPass={{
            pageNumber: 1
          }}
          side={'left'}
        />
        <Button 
          name={'Próximo'} 
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
                name={"Algoritmo BioInspirado"}
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
              title={"Seleção em andamento..."}
              description={
                `A seleção com o algoritmo ${choosenAlgorithm} está sendo executada!`
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
              title={"Selecionando..."}

              showButton
              buttonName={"Fechar"}
              action={() => {
                setSelected("hide progress")
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
                    `Estimativa de finalização: ${(timeForEstimation).toFixed(0)} minuto(s)`
                  }
                </p>
              </div>
            </PopUp>
          }

          {
            selected == "error" &&
            <PopUp 
              show={true}
              title={"Erro"}
              description={
                `Um erro interno do servidor não permitiu concluir a seleção.`
              }

              showButton
              buttonName={"Fechar"}
              action={() => {
                setSelected("false");
              }}
            />
          }

          {
            selected == "finished" &&
            <PopUp 
              show={true}
              title={"Seleção finalizada"}
              description={
                `Seleção finalizada.`
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
                  Salvar e Selecionar
                </button>
              :
                <button 
                  onClick={() => {
                    setSelected("show progress");
                  }}
                  className={styles.button}
                >
                  Mostrar progresso
                </button>
              
            )
          }

        </div>
        
        <Button
          name={'Voltar'} 
          URL={`/variables-selection`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'left'}
        />
        {
          algorithmIndex == 0 &&
          <Button 
            name={'Próximo'} 
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
            name={"Linhas para remover:"}
            width={"80%"}
            setValue={setRowsToRemove}
            value={rowsToRemove}
          />
        </div>
        
        <Button 
          name={'Voltar'} 
          URL={`/variables-selection`}
          stateToPass={{
            pageNumber: 1
          }}
          side={'left'}
        />
        <Button 
          name={'Próximo'} 
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
                        <p>Nome: {dbInformation.name}</p>
                        <p>Data: {dbInformation.created_at}</p>
                        <p>{dbInformation.lines} linhas e {dbInformation.columns} colunas</p>
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
          name={'Voltar'} 
          URL={`/variables-selection`}
          stateToPass={{
            pageNumber: 2
          }}
          side={'left'}
        />
        <Button 
          name={'Próximo'} 
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