import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import styles from './styles.module.css';

import { ProgressBar } from '../../components/ProgressBar';
import { Header } from '../../components/Header';

import { RadionInput } from '../../components/RadioInput';
import { InlineInput } from '../../components/InlineInput';
import Button from '../../components/Button';
import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';

import PopUp from '../../components/PopUp';
import ProgressBarLoading from '../../components/ProgressBarLoading';

import { 
  getTrainingProgress,
  setTrainingProgress, 
  getTrainingSettings, 
  setTrainingSettings, 
  train 
} from '../../api/training';

import { updateStatus } from '../../api/project';

import Loading from '../../components/Loading';
import ProgressContext from '../../context/ProgressContext';

import { delayTimeForGetProgress } from '../../settings';

export const algorithms = [
  "Random Forest",
  "Linear Regression",
  "KNN",
  "Support Vector Machines (SVM)",
];
const disabledInputs = [1, 2, 3];

export const algorithmsDescriptions = [
  "The Random Forest algorithm is a machine learning method that combines multiple decision trees to make more accurate and stable decisions. It works by creating a set of decision trees, each trained on a random sample of the data and using different sets of features. When making predictions, the trees vote together, and the class or value with the most votes is chosen as the final prediction. This reduces the tendency of overfitting and improves the robustness of the model.",
  "Linear regression is a supervised machine learning algorithm used to model the relationship between one (or more) independent variables and a dependent variable, usually of a continuous nature. It assumes that the relationship between the variables can be represented by a straight line, hence the term 'linear'. The goal is to find the coefficients that best fit this line to the data, in order to minimize the difference between the model's predictions and the actual values.",
  "The KNN (K-Nearest Neighbors) algorithm is a simple and powerful technique in the field of machine learning. Its simplicity is one of its main advantages, making it easy to understand and implement. It operates on the principle of 'nearest neighbors', where decisions are based on the proximity of data points in the feature space.",
  "Support Vector Machines are machine learning algorithms used in both classification and regression tasks. The SVM seeks to find a hyperplane that best separates the classes in a multidimensional space, maximizing the margin between the classes. This makes SVM effective in classifying non-linear data and handling high-dimensional data. Additionally, SVMs can make use of kernel tricks to transform data into more complex feature spaces, thereby addressing more challenging classification problems."
];

export const algorithmsParameters = [
  [["n_estimators", "Number of trees"], ["max_features", "Features quantity"]],
  [["regularization", "Regularization"]],
  [["k_neighbors", "K neighbors quantity"]],
  [["kernel", "Kernel"], ["CParameter", "C Parameter"]],
];

export default function Training() {

  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);
  const { projectID } = useParams();

  const navigate = useNavigate();

  const href = '/training';
  const progress = 3;

  const location = useLocation();
  const state = location.state;

  let pageNumber = 0;
  if(state) {
    if(state.pageNumber) {
      pageNumber = state.pageNumber;
    }
  }

  const [choosenAlgorithm, setChoosenAlgorithm] = useState(algorithms[0]);
  const [algorithmParameters, setAlgorithmParameters] = useState({});
  const [withFullSet, setWithFullSet] = useState(false);
  
  const [trained, setTrained] = useState("false");

  const [progressValue, setProgressValue] = useState(0);
  const [maximumValue, setMaximumValue] = useState(100);
  const [timeForEstimation, setTimeForEstimation] = useState(0);

  const [algorithmIndex, setAlgorithmIndex] = useState(0);

  const changeParameters = (key, value) => {
    let values = algorithmParameters;
    values[key] = value;
    setAlgorithmParameters(values);
  }

  const nextActionButton = async() => {
    const trainingSettings = await getTrainingSettings(projectID, authTokens.access);

    if(
      trainingSettings.algorithm == choosenAlgorithm && 
      trainingSettings.withFullSet == withFullSet
      ) {
      return true;

    } else {
      const response = await setTrainingSettings(
        projectID, 
        choosenAlgorithm, 
        algorithmParameters,
        withFullSet,
        authTokens.access
      );
      return response;
    }
  }

  const saveAndTrain = async() => {
    
    const response = await setTrainingSettings(
      projectID, 
      choosenAlgorithm, 
      algorithmParameters,
      withFullSet,
      authTokens.access
    );
    
    setTrained("first time");
    if(response) {
      const response = await train(projectID, authTokens.access);
      
      if(response.status == 500) {
        setTrained("error");
        alert("Ocorreu um erro!");
      } else {
        setTrained("finished");
        alert("Finalizou!");
      }
      localStorage.removeItem(`progress_${projectID}`);

      return true;
    }
    return false;
  }

  const navigateToResults = () => {
    navigate(`/${projectID}/results`);
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
    if(trained != "false") {
      const response = await getTrainingProgress(projectID, authTokens.access);
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
              route: 'training',
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
  }

  useEffect(() => {
    getTrainingSettings(projectID, authTokens.access)
    .then((response) => {
      setChoosenAlgorithm(response.algorithm);

      setAlgorithmParameters(response.parameters);

      setWithFullSet(response.withFullSet);

      if(response.algorithmProgress) {
        const split = response.algorithmProgress.split('/');
        setProgressValue(Number(split[0]));
        setMaximumValue(Number(split[1]));

        setTrained("hide progress");
      }
    })
    .catch(error => {
      console.log(error);
    })

  }, []);

  useEffect(() => {
    // A função será executada a cada quantidade de segundos
    const interval = setInterval(getProgress, delayTimeForGetProgress);
    // Função de limpeza para interromper o intervalo quando 
    // o componente for desmontado
    return () => clearInterval(interval);
  }, [trained]);

  useEffect(() => {
    const index = algorithms.indexOf(choosenAlgorithm);
    setAlgorithmIndex(index);

  }, [choosenAlgorithm]);

  useEffect(() => {
  }, [withFullSet])

  useEffect(() => {
    updateStatus(projectID, authTokens.access, 'Treinamento');
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

          <div>
            <RadionInput 
              name={"Apply algorithm"}
              options={algorithms}
              setOption={setChoosenAlgorithm}
              firstOption={choosenAlgorithm}
              disabledInputs={disabledInputs}
            />
            {
            /*
              <CheckboxInput 
                name={"Com conjunto completo?"}
                value={withFullSet} 
                setValue={setWithFullSet}
              /> 
            */
            }
            <p>Without using full set</p>
            
          </div>
          
          <div className={styles.informationContainer}>
            <p className={styles.information}>
              {algorithmsDescriptions[algorithms.indexOf(choosenAlgorithm)]}
            </p>
          </div>

        </div>

        <Button 
          name={'Back'} 
          URL={'/variables-selection'}
          stateToPass={{
            pageNumber: 2
          }}
          side={'left'}
        />
        <Button 
          name={'Next'} 
          URL={'/training'}
          stateToPass={{
            pageNumber: 1
          }}
          side={'right'}
          action={nextActionButton}
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

        <div className={styles.contentContainer}>
          <div className={styles.leftDiv}>
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
            {
              trained == "false"
              ?
                <button 
                  onClick={saveAndTrain}
                  className={styles.button}
                >
                  Save and train
                </button>
              :
                <button 
                  onClick={() => {
                    setTrained("show progress");
                  }}
                  className={styles.button}
                >
                  Show progress
                </button>
            }
          </div>

        </div>

        {
          trained == "first time" &&
          <PopUp 
            show={true}
            title={"Training in progress..."}
            description={`The training with the ${choosenAlgorithm} algorithm is being executed!`}

            showButton
            buttonName={"Ok"}
            action={() => {
              setTrained("show progress");
            }}
          />
        }

        {
          trained == "show progress" &&
          <PopUp 
            show={true}
            title={"Training..."}

            showButton
            buttonName={"Close"}
            action={() => {
              setTrained("hide progress");
            }}
          >
            <Loading size={45} />
            <div className={styles.progressContainer}>
              <ProgressBarLoading 
                progress={progressValue}
                maximum={maximumValue}
              />
              <p>
                {(progressValue / maximumValue * 100).toFixed(0)}%
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
          trained == "error" &&
          <PopUp 
            show={true}
            title={"Training problem"}
            description={
              `An internal server error prevented the training from being completed.`
            }

            showButton
            buttonName={"Close"}
            action={() => setTrained("false")}
          />
        }

        {
          trained == "finished" &&
          <PopUp 
            show={true}
            title={"Training completed"}
            description={
              `The training with the ${choosenAlgorithm} algorithm is completed! Click the button below to see the training results!`
            }

            showButton
            buttonName={"See results"}
            action={navigateToResults}
          />
        }

        <Button 
          name={'Back'} 
          URL={'/training'}
          stateToPass={{
            pageNumber: 0
          }}
          side={'left'}
        />
        {
          trained == "finished" &&
          <Button 
            name={'Next'} 
            URL={'/results'}
            stateToPass={{
              pageNumber: 0
            }}
            side={'right'}
          />
        }
      </>
    )
  }
}