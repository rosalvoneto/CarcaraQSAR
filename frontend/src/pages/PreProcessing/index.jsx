import { useContext, useEffect, useState } from 'react';
import { Header } from '../../components/Header';

import { ProgressBar } from '../../components/ProgressBar';
import { projectName } from '../../settings';

import { Graph } from '../../components/Graph';
import { RadionInput } from '../../components/RadioInput';

import styles from './styles.module.css';

import Button from '../../components/Button';
import { VariablesList } from '../../components/VariablesList';

import { useLocation, useParams } from 'react-router-dom';
import { getBoxPlot, getHistogram, getProject } from '../../api/database';

import AuthContext from '../../context/AuthContext';

import { convertStringToCSVMatrix, transporMatriz } from '../../utils';

export const options = [
  "MinMaxScaler",
  "StandardScaler",
  "RobustScaler",
  "Normalizer",
  "QuantileTransformer",
  "PowerTransformer",
  "FunctionTransformer",
];

export const optionsDescriptions = [
  "O MinMaxScaler é um método de normalização que dimensiona os dados para um intervalo específico, geralmente entre 0 e 1. Isso é alcançado transformando os valores de tal forma que o valor mínimo se torna 0 e o valor máximo se torna 1, preservando a relação de proporção entre os dados originais.",
  "O StandardScaler é um método de normalização que transforma os dados de tal forma que eles tenham média zero e desvio padrão igual a 1. Isso é útil para dados que seguem uma distribuição normal e ajuda a eliminar o viés de escala nos algoritmos de aprendizado de máquina.",
  "O RobustScaler é uma técnica de normalização que é resistente a outliers. Ele dimensiona os dados, tornando-os robustos a valores discrepantes, usando estatísticas robustas, como a mediana e o intervalo interquartil.",
  "O Normalizer é um método de normalização que ajusta cada amostra de dados individualmente, escalando os valores para que eles tenham norma 1. Isso é útil quando o comprimento das amostras é importante, como em tarefas de processamento de texto ou séries temporais.",
  "O QuantileTransformer é um método de normalização que transforma os dados de forma que a distribuição resultante seja uma distribuição uniforme. Isso é feito por meio de mapeamento dos valores para percentis de uma distribuição de referência, o que é útil para lidar com dados que não seguem uma distribuição normal.",
  "O PowerTransformer é uma técnica de normalização que aplica uma transformação que torna os dados mais semelhantes a uma distribuição normal. Ele inclui duas opções comumente usadas: Box-Cox e Yeo-Johnson, que lidam com diferentes tipos de dados.",
  "O FunctionTransformer é um método de normalização que permite aos usuários aplicar funções personalizadas para transformar seus dados. Isso é útil quando os dados requerem uma transformação não linear específica.",
];

export function PreProcessing({ index }) {

  const { authTokens } = useContext(AuthContext);
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

  const [option, setOption] = useState(options[0]);
  const [project, setProject] = useState(null);
  const [variablesNames, setVariablesNames] = useState([]);
  const [matrix, setMatrix] = useState([]);
  
  const [histogram, setHistogram] = useState(null);
  const [boxPlot, setBoxPlot] = useState(null);

  const getGraphs = (indexOfMatrix) => {
    getHistogram(projectID, 'name', authTokens.access, matrix[indexOfMatrix])
    .then((response) => {

      const imagemBase64 = response.imageInBase64;
      // Cria a URL da imagem a partir da string Base64
      const urlImagem = `data:image/png;base64,${imagemBase64}`;
      setHistogram(urlImagem);
    })
    .catch((error) => {
      console.log(error);
    })

    getBoxPlot(projectID, 'name', authTokens.access, matrix[indexOfMatrix])
    .then((response) => {

      const imagemBase64 = response.imageInBase64;
      // Cria a URL da imagem a partir da string Base64
      const urlImagem = `data:image/png;base64,${imagemBase64}`;
      setBoxPlot(urlImagem);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  useEffect(() => {
    getProject(projectID, authTokens.access)
    .then((response) => {
      console.log(response);
      setProject(response);
    })
    .catch((error) => {
      console.log(error);
    })
  }, [])

  useEffect(() => {
    if(project) {
      let matrix = convertStringToCSVMatrix(project.databaseFile, ',');
      setVariablesNames(matrix[0]);

      matrix.splice(0, 1);      
      const tMatrix = transporMatriz(matrix);
      setMatrix(tMatrix);

      getGraphs(0);
    }
  }, [project])

  const onChangeVariable = (index) => {
    getGraphs(index);
  }

  if(pageNumber == 0) {
    return(
      <>
        <Header 
          title={
            project && project.projectData.name
          }
        />
        <ProgressBar 
          progressNumber={progress}
          subProgressNumber={pageNumber}
        />

        <div className={styles.firstContainer}>
          <VariablesList
            onChange={(index) => onChangeVariable(index)}
            variablesNames={variablesNames}
          />

          <div className={styles.graphsContainer}>

            {
              histogram &&
              <Graph name={"Histograma"} image={histogram}/>
            }
            {
              boxPlot &&
              <Graph name={"Box-Plot"} image={boxPlot}/>
            }

          </div>

        </div>
        
        <Button 
          name={'Voltar'} 
          URL={`/${projectID}/database`}
          side={'left'}
        />
        <Button 
          name={'Próximo'} 
          URL={`/${projectID}/pre-processing`} 
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
          title={projectName}
        />
        <ProgressBar 
          progressNumber={progress}
          subProgressNumber={pageNumber}
        />

        <div className={styles.secondContainer}>

          <RadionInput 
            name={"Normalização dos dados"}
            options={options} 
            setOption={setOption}
          />
          <div className={styles.informationContainer}>
            <p className={styles.information}>
              {optionsDescriptions[options.indexOf(option)]}
            </p>
          </div>

        </div>

        <Button 
          name={'Voltar'} 
          URL={`/${projectID}/pre-processing`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'left'}
        />
        <Button 
          name={'Próximo'} 
          URL={`/variables-selection`}
          side={'right'}
        />
      </>
    )
  }
}