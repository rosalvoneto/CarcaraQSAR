import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CaretRight, CaretLeft } from '@phosphor-icons/react';

import styles from './styles.module.css';

import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';
import { RadionInput } from '../../components/RadioInput';
import Button from '../../components/Button';
import { Selector } from '../../components/Selector';
import { Option } from '../../components/Selector/Option';

import { getVariablesSettings, setVariablesSettings } from '../../api/training';

import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';
import { InlineInput } from '../../components/InlineInput';


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
    ["Interations", "Interações"],
    ["Population", "População"]
  ],
  [
    ["Interations", "Interações"],
    ["Bees", "Abelhas"],
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

  const handleChangeRemoveConstantVariables = (value) => {
    if(value === optionsToRemoveVariables[0]) {
      setRemoveConstantVariables(true);
    } else {
      setRemoveConstantVariables(false);
    }
  }

  const nextButtonAction = async() => {
    const response = await setVariablesSettings(
      projectID,
      choosenAlgorithm,
      removeConstantVariables,
      rightListOfVariables,
      authTokens.access
    );
    return response;
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

  const saveAndSelect = () => {
    
  }

  useEffect(() => {
    getVariablesSettings(projectID, authTokens.access)
    .then(response => {
      console.log(response.algorithm);
      setChoosenAlgorithm(response.algorithm);

      console.log(response.removeConstantVariables);
      setRemoveConstantVariables(response.removeConstantVariables);

      console.log(response.variablesToRemove);
      setRightListOfVariables(response.variablesToRemove);
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
          action={nextButtonAction}
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
            <RadionInput 
              name={"Algoritmo BioInspirado"}
              options={algorithms}
              setOption={setChoosenAlgorithm}
              firstOption={choosenAlgorithm}
            />
            <div className={styles.informationContainer}>
              <p className={styles.information}>
                { algorithmsDescriptions[algorithmIndex] }
              </p>
            </div>
          </div>

          {
            algorithmIndex != 0
            ?
              <p className={styles.name}>
                <strong>{"Hiperparâmetros"}</strong>
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

          <button 
            onClick={saveAndSelect}
            className={styles.button}
          >
            Salvar e Selecionar
          </button>
        </div>
        
        <Button 
          name={'Voltar'} 
          URL={`/variables-selection`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'left'}
        />
        <Button 
          name={'Próximo'} 
          URL={`/variables-selection`} 
          stateToPass={{
            pageNumber: 2
          }}
          side={'right'}
          action={nextButtonAction}
        />
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
          URL={`/training`} 
          stateToPass={{
            pageNumber: 0
          }}
          side={'right'}
          action={nextButtonAction}
        />
      </>
    )
  }
}