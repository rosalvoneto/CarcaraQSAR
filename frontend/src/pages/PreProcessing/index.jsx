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

import { updateStatus } from '../../api/project';

import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';

import { InlineInput } from '../../components/InlineInput';

import HelpContainer from '../../components/HelpContainer';
import Loading from '../../components/Loading';

export const normalizations = [
  "Do not apply",
  "MinMaxScaler",
  "StandardScaler",
  "RobustScaler",
  "Normalizer",
];

export const normalizationsDescriptions = [
  "No changes will be applied to the Database.",
  "The MinMaxScaler is a normalization method that scales the data to a specific range, usually between 0 and 1. This is achieved by transforming the values so that the minimum value becomes 0 and the maximum value becomes 1, preserving the proportional relationship between the original data.",
  "The StandardScaler is a normalization method that transforms the data so that they have a mean of zero and a standard deviation of one. This is useful for data that follows a normal distribution and helps eliminate scale bias in machine learning algorithms.",
  "The RobustScaler is a normalization technique that is resistant to outliers. It scales the data, making it robust to outliers, using robust statistics such as the median and the interquartile range.",
  "The Normalizer is a normalization method that adjusts each data sample individually, scaling the values so that they have a norm of 1. This is useful when the length of the samples is important, such as in text processing or time series tasks.",
];

export default function PreProcessing({ index }) {

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

  const nextActionButton = async () => {
    const response = await setNormalizationSettings(
      projectID, choosenNormalization, authTokens.access
    );
    return response;
  }

  useEffect(() => {
    getNormalizationSettings(projectID, authTokens.access)
    .then(response => {
      setChoosenNormalization(response.normalization);
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  useEffect(() => {
    updateStatus(projectID, authTokens.access, 'Pre-processing');
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
            {
              histogram
              ? <Graph name={"Histogram"} image={histogram}/>
              : <Loading/>
            }
            {
              boxPlot
              ? <Graph name={"Box-Plot"} image={boxPlot}/>
              : <Loading/>
            }
          </div>

          <div>
            <InlineInput 
              name={"Divisions for histogram: "} type={'number'}
              value={divisions}
              width={65}
            />
            <HelpContainer />
            <div className={styles.ballonInformationContainer}>
              <p className={styles.ballonInformation}>
                {`${numberOfNaNValues} NaN values disregarded`}
              </p>
            </div>
          </div>

        </div>
        
        <Button 
          name={'Back'} 
          URL={`/database`}
          side={'left'}
        />
        <Button 
          name={'Next'} 
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
              name={"Normalization"}
              options={normalizations} 
              setOption={setChoosenNormalization}
              firstOption={choosenNormalization}
            />
          </div>
          <div className={styles.informationContainer}>
            <p className={styles.information}>
              {normalizationsDescriptions[normalizations.indexOf(choosenNormalization)]}
            </p>
          </div>

        </div>

        <Button 
          name={'Back'} 
          URL={`/pre-processing`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'left'}
        />
        <Button 
          name={'Next'} 
          URL={`/variables-selection`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'right'}
          action={nextActionButton}
        />
      </>
    )
  }
}