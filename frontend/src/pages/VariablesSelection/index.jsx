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
  makeSelection
} 
from '../../api/variablesSelection';
import { downloadDatabase, getDatabases } from '../../api/database';

import { DownloadSimple } from '@phosphor-icons/react';

import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';
import { InlineInput } from '../../components/InlineInput';
import PopUp from '../../components/PopUp';
import Loading from '../../components/Loading';
import ProgressBarLoading from '../../components/ProgressBarLoading';


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
    ['info_gain_quantity', 'Ganho de informação'],
    ["probability_crossover", "Probabilidade de crossover"],
    ['probability_mutation', 'Probabilidade de mutação'],
    ['limit_generations', 'Limite de gerações'],
    ['limit_not_improvement', 'Limite sem melhoria'],
    ['r2_condition_BFS', 'R2 do BFS'],
    ['limit_not_improvement_BFS', 'Limite sem melhoria do BFS'],
  ],
  [
    ["maximum_iterations", "Interações"],
    ["bees", "Abelhas"],
    ["limit_not_improvement", "Limite sem melhoria"],
    ["info_gain_quantity", "Ganho de informação"],
    ['r2_condition_BFS', 'R2 do BFS'],
    ['limit_not_improvement_BFS', 'Limite sem melhoria do BFS'],
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

  let pageNumber = 0;
  if(state) {
    if(state.pageNumber) {
      pageNumber = state.pageNumber;
    }
  }

  const [choosenAlgorithm, setChoosenAlgorithm] = useState();
  const [algorithmIndex, setAlgorithmIndex] = useState(0);
  const [algorithmParameters, setAlgorithmParameters] = useState({});

  const [removeConstantVariables, setRemoveConstantVariables] = useState();

  const [rightListOfVariables, setRightListOfVariables] = useState([]);
  const [temporaryListToRemove, setTemporaryListToRemove] = useState([]);
  const [temporaryListToAdd, setTemporaryListToAdd] = useState([]);

  const [rowsToRemove, setRowsToRemove] = useState("");

  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState("false");
  const [errorMessage, setErrorMessage] = useState("");

  const [databases, setDatabases] = useState([]);

  const navigate = useNavigate();

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

    setSelecting(true);
    const response = await makeSelection(projectID, authTokens.access);
    
    if(response.error) {
      setSelecting(false);
      setSelected("error");
      setErrorMessage(response.error);
    } else {
      setSelecting(false);
      setSelected("true");
    }
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

    let response = await downloadDatabase(
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

    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  useEffect(() => {
    const index = algorithms.indexOf(choosenAlgorithm);
    console.log("Índice do algoritmo:", index);
    setAlgorithmIndex(index);

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
              {
                algorithmIndex != 0
                ?
                  <p className={styles.name}>
                    {/* <strong>{"Hiperparâmetros"}</strong> */}
                  </p>
                : 
                  undefined
              }
              <div className={styles.parametersContainer}>
                {
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
                }
              </div>
            </div>

            <div className={styles.informationContainer}>
              <p className={styles.information}>
                { algorithmsDescriptions[algorithmIndex] }
              </p>
            </div>
          </div>

          <PopUp show={selecting}
            title={"Selecionando..."}
          >
            <Loading size={45} />
            <div className={styles.progressContainer}>
              <ProgressBarLoading 
                progress={12}
                maximum={100}
              />
              <p>
                {(12 / 100 * 100).toFixed(0)}%
              </p>
            </div>
          </PopUp>

          <PopUp show={selected == "true"}
            title={"Seleção finalizada"}
            description={
              `A seleção com o algoritmo ${choosenAlgorithm} está finalizada! Clique no botão abaixo para ir para o próximo passo!`
            }
            showButton
            buttonName={"Próximo"}
            action={() => {
              const url = '/variables-selection';
              navigate(`/${projectID}${url}`, { state: {
                pageNumber: 2
              }});
            }}
          />

          <PopUp show={selected == "error"}
            title={"Erro"}
            description={
              `Um erro interno do servidor não permitiu concluir a seleção.\n
              ${errorMessage}.`
            }
            showButton
            buttonName={"Ok"}
            action={() => {
              setSelecting(false);
              setSelected("false");
            }}
          />

          {
            algorithmIndex != 0 &&
            <button 
              onClick={handleToMakeSelection}
              className={styles.button}
            >
              Salvar e Selecionar
            </button>
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
                        className={styles.downloadButton}
                        onClick={() => {
                          handleDownload(index);
                        }}
                      >
                        <DownloadSimple size={30} color='var(--black-color-1)' />
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