import { useContext, useEffect, useState } from 'react';
import { Header } from '../../components/Header';

import { ProgressBar } from '../../components/ProgressBar';

import { Graph } from '../../components/Graph';
import { RadionInput } from '../../components/RadioInput';

import styles from './styles.module.css';

import Button from '../../components/Button';
import { VariablesList } from '../../components/VariablesList';

import { useLocation, useParams } from 'react-router-dom';
import { 
  getVariables, getBoxPlot, getHistogram,
  getNormalizationSettings,
  setNormalizationSettings
} from '../../api/database';

import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';

import { InlineInput } from '../../components/InlineInput';

import HelpContainer from '../../components/HelpContainer';

export const normalizations = [
  "NÃO APLICAR",
  "MinMaxScaler",
  "StandardScaler",
  "RobustScaler",
  "Normalizer",
];

export const normalizationsDescriptions = [
  "Nenhuma mudança será aplicada no Database.",
  "O MinMaxScaler é um método de normalização que dimensiona os dados para um intervalo específico, geralmente entre 0 e 1. Isso é alcançado transformando os valores de tal forma que o valor mínimo se torna 0 e o valor máximo se torna 1, preservando a relação de proporção entre os dados originais.",
  "O StandardScaler é um método de normalização que transforma os dados de tal forma que eles tenham média zero e desvio padrão igual a 1. Isso é útil para dados que seguem uma distribuição normal e ajuda a eliminar o viés de escala nos algoritmos de aprendizado de máquina.",
  "O RobustScaler é uma técnica de normalização que é resistente a outliers. Ele dimensiona os dados, tornando-os robustos a valores discrepantes, usando estatísticas robustas, como a mediana e o intervalo interquartil.",
  "O Normalizer é um método de normalização que ajusta cada amostra de dados individualmente, escalando os valores para que eles tenham norma 1. Isso é útil quando o comprimento das amostras é importante, como em tarefas de processamento de texto ou séries temporais.",
];

export function PreProcessing({ index }) {

  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);
  const { projectID } = useParams();

  const href = '/pre-processing';
  const progress = 1;

  const location = useLocation();
  const state = location.state;

  let pageNumber = 0;
  if(state) {
    if(state.pageNumber) {
      pageNumber = state.pageNumber;
    }
  }

  // Primeira página do Pré-processing
  const [variablesNames, setVariablesNames] = useState([]);
  const [variable, setVariable] = useState(null);

  const [histogram, setHistogram] = useState(null);
  const [divisions, setDivisions] = useState(20);
  const [boxPlot, setBoxPlot] = useState(null);

  const [numberOfNaNValues, setNumberOfNaNValues] = useState(0);

  const pullHistogram = async () => {
    setHistogram(null);
    // Resgata o Histograma
    const response = await getHistogram(
      projectID, variable, divisions, authTokens.access
    );
    
    // Atualiza quantidade de valores NaN no array atual
    setNumberOfNaNValues(response.numberOfNaNValues);

    const histogram = response.imageInBase64;
    // Cria a URL da imagem a partir da string Base64
    const histogramImage = `data:image/png;base64,${histogram}`;

    return histogramImage;
  }

  const pullBoxPlot = async () => {
    setBoxPlot(null);
    // Resgata o BoxPlot
    const response = await getBoxPlot(projectID, variable, authTokens.access);

    // Atualiza quantidade de valores NaN no array atual
    setNumberOfNaNValues(response.numberOfNaNValues);

    const boxPlot = response.imageInBase64;
    // Cria a URL da imagem a partir da string Base64
    const boxPlotImage = `data:image/png;base64,${boxPlot}`;

    return boxPlotImage;
  }
  
  const getGraphs = async () => {
    const histogramImage = await pullHistogram();
    setHistogram(histogramImage);
    const boxPlotImage = await pullBoxPlot();
    setBoxPlot(boxPlotImage);
  }

  const onChangeVariable = (index, variableName) => {
    // Setar variável escolhida
    setVariable(variableName);
  }

  useEffect(() => {
    // Recuperar Database
    getVariables(projectID, authTokens.access)
    .then((response) => {
      if(response.variables) {
        // Salvar nomes das variáveis
        setVariablesNames(response.variables);
      }
    })
    .catch((error) => {
      console.log(error);
    })  
  }, [])

  useEffect(() => {
    // Setar variável escolhida
    setVariable(variablesNames[0]);
  }, [variablesNames])

  useEffect(() => {
    if(variable) {
      // Recuperar os gráficos
      getGraphs();
    }
  }, [variable])

  // Segunda página do Pré-processing
  const [choosenNormalization, setChoosenNormalization] = useState();

  const nextButtonAction = () => {
    const response = setNormalizationSettings(
      projectID, choosenNormalization, authTokens.access
    );
    return response;
  }

  useEffect(() => {
    getNormalizationSettings(projectID, authTokens.access)
    .then(response => {
      console.log(response.normalization);
      setChoosenNormalization(response.normalization);
    })
    .catch(error => {
      console.log(error);
    })
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

        <div className={styles.firstContainer}>
          <VariablesList
            variablesNames={variablesNames}
            onChangeVariable={onChangeVariable}
          />

          <div className={styles.graphsContainer}>
            <Graph name={"Histograma"} image={histogram}/>
            <Graph name={"Box-Plot"} image={boxPlot}/>
          </div>

          <div>
            <InlineInput 
              name={"Divisões para o Histograma: "} type={'number'}
              value={divisions}
              width={65}
            />
            <HelpContainer />
            <div className={styles.ballonInformationContainer}>
              <p className={styles.ballonInformation}>
                {`${numberOfNaNValues} valor(es) NaN desconsiderados`}
              </p>
            </div>
          </div>

        </div>
        
        <Button 
          name={'Voltar'} 
          URL={`/database`}
          side={'left'}
        />
        <Button 
          name={'Próximo'} 
          URL={`/pre-processing`} 
          stateToPass={{
            pageNumber: 1
          }}
          side={'right'}
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

        <div className={styles.secondContainer}>

          <div>
            <RadionInput 
              name={"Normalização dos dados"}
              options={normalizations} 
              setOption={setChoosenNormalization}
              firstOption={choosenNormalization}
            />
            {
              choosenNormalization != normalizations[0] && undefined
              /* <a onClick={() => {}}>Normalizar</a> */
            }
          </div>
          <div className={styles.informationContainer}>
            <p className={styles.information}>
              {normalizationsDescriptions[normalizations.indexOf(choosenNormalization)]}
            </p>
          </div>

        </div>

        <Button 
          name={'Voltar'} 
          URL={`/pre-processing`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'left'}
        />
        <Button 
          name={'Próximo'} 
          URL={`/variables-selection`}
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