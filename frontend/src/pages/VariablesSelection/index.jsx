import { useContext, useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';

import styles from './styles.module.css';

import { projectName } from '../../settings';
import { RadionInput } from '../../components/RadioInput';
import Button from '../../components/Button';
import { Selector } from '../../components/Selector';
import { Option } from '../../components/Selector/Option';
import { getTrainingSettings, setTrainingSettings } from '../../api/training';
import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';
import { useParams } from 'react-router-dom';

export const algorithms = [
  "NÃO APLICAR",
  "Colônia de formigas",
  "Algoritmo genético",
  "Colônia de abelhas",
  "Cardume de peixes",
];

export const algorithmsDescriptions = [
  "Nenhum algoritmo foi escolhido",
  "O algoritmo de Colônia de Formigas é inspirado no comportamento de formigas reais que comunicam e colaboram para encontrar caminhos mais curtos entre a fonte de comida e o ninho. Neste algoritmo, agentes virtuais imitam esse comportamento, deixando trilhas de feromônios para indicar rotas eficazes, criando uma solução otimizada para problemas de otimização, como o Problema do Caixeiro Viajante.",
  "Os Algoritmos Genéticos são uma técnica de otimização baseada na seleção natural e genética. Eles operam em populações de soluções candidatas e utilizam operadores genéticos, como mutação e cruzamento, para evoluir e melhorar essas soluções ao longo de várias gerações. Esses algoritmos são amplamente usados para encontrar soluções aproximadas para problemas complexos de otimização e busca.",
  "Inspirado no comportamento de colônias de abelhas, o Algoritmo de Colônia de Abelhas é uma técnica de otimização baseada na exploração de soluções candidatas em um espaço de busca. Abelhas virtuais procuram soluções em locais específicos e compartilham informações sobre a qualidade das soluções encontradas com outras abelhas, permitindo a convergência para uma solução ótima em problemas de otimização complexos.",
  "O Algoritmo de Cardume de Peixes, também conhecido como Algoritmo de Otimização de Cardume, é uma técnica inspirada no comportamento de peixes em um cardume. Os indivíduos virtuais (peixes) ajustam sua posição e velocidade com base nas posições e movimentos dos vizinhos, colaborando para encontrar soluções otimizadas para problemas de otimização multidimensional, como a busca por ótimos locais em espaços de busca complexos.",
]

export const optionsToRemoveVariables = ["Sim", "Não"];

export default function VariablesSelection() {

  const href = '/variables-selection';
  const progress = 2;

  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);
  const { projectID } = useParams();

  const [choosenAlgorithm, setChoosenAlgorithm] = useState();
  const [removeVariablesConstants, setRemoveVariablesConstants] = useState();
  const [selectedVariables, setSelectedVariables] = useState([]);

  const handleChangeRemoveVariablesConstants = (value) => {
    if(value === optionsToRemoveVariables[0]) {
      setRemoveVariablesConstants(true);
    } else {
      setRemoveVariablesConstants(false);
    }
  }

  const nextButtonAction = async() => {
    const response = await setTrainingSettings(
      projectID, choosenAlgorithm, removeVariablesConstants, authTokens.access
    );
    return response;
  }

  useEffect(() => {
    getTrainingSettings(projectID, authTokens.access)
    .then(response => {
      console.log(response.algorithm);
      setChoosenAlgorithm(response.algorithm);

      console.log(response.removeConstantsVariables);
      setRemoveVariablesConstants(response.removeConstantsVariables);
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  return(
    <>
      <Header 
        title={projectName}
      />
      <ProgressBar progressNumber={progress}/>
      <div className={styles.container}>
        <div className={styles.algorithmContainer}>
          <RadionInput 
            name={"Aplicar algoritmo BioInspirado"}
            options={algorithms}
            setOption={setChoosenAlgorithm}
            firstOption={choosenAlgorithm}
          />
          <div className={styles.informationContainer}>
            <p className={styles.information}>
              { algorithmsDescriptions[algorithms.indexOf(choosenAlgorithm)] }
            </p>
          </div>
        </div>

        <RadionInput 
          name={"Remover automaticamente variáveis constantes"}
          options={optionsToRemoveVariables}
          setOption={handleChangeRemoveVariablesConstants}
          firstOption={
            removeVariablesConstants
            ? optionsToRemoveVariables[0]
            : optionsToRemoveVariables[1]
          }
        />

        <Selector 
          selectedVariables={selectedVariables}
          setSelectedVariables={setSelectedVariables}
        />
        <div className={styles.selectedVariablesContainer}>
          {
            selectedVariables.map(selectedVariable => {
              return(
                <Option text={selectedVariable} />
              )
            })
          }
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