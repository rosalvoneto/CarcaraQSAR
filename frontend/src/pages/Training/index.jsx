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
  getTrainingSettings, 
  setTrainingSettings, 
  makeTraining,
  cancelTraining,
  checkTrainingStatus,
  getTrainingProgress,
  setTrainingProgress, 
} from '../../api/training';

import { updateStatus } from '../../api/project';

import Loading from '../../components/Loading';

import { delayTimeForGetProgress } from '../../settings';

export const algorithms = [
  "Random Forest",
  "Linear regression",
  "KNN",
  "Support Vector Machines (SVM)",
];
const disabledInputs = [1, 2, 3];

export const algorithmsDescriptions = [
  "The Random Forest algorithm is a machine learning method that combines multiple decision trees to make more accurate and stable decisions. It works by creating a set of decision trees, each trained on a random sample of the data and using different sets of features. When making predictions, the trees vote together, and the class or value with the most votes is chosen as the final prediction. This reduces the tendency of overfitting and improves the robustness of the model.",
  "Linear regression is a supervised machine learning algorithm used to model the relationship between one (or more) independent variables and a dependent variable, usually of a continuous nature. It assumes that the relationship between the variables can be represented by a straight line, hence the term 'linear'. The goal is to find the coefficients that best fit this line to the data, so as to minimize the difference between the model's predictions and the actual values.",
  "The KNN (K-Nearest Neighbors) algorithm is a simple and powerful technique in the field of machine learning. Its simplicity is one of its main advantages, making it easy to understand and implement. It operates on the principle of 'nearest neighbors', where decisions are based on the proximity of data points in the feature space.",
  "Support Vector Machines (SVMs) are machine learning algorithms used for both classification and regression tasks. The SVM seeks to find a hyperplane that best separates the classes in a multidimensional space, maximizing the margin between the classes. This makes SVM effective in classifying non-linear data and handling high-dimensional data. Additionally, SVMs can make use of kernel tricks to transform data into more complex feature spaces, thus addressing more challenging classification problems."
];


export const algorithmsParameters = [
  [
    ["n_estimators", "Number of Trees", 50, 'Number of decision trees that will be created in the Random Forest model.'], 
    ["max_features", "Number of Features", 5, 'Number of features (or variables) randomly selected to consider when splitting a node in each tree.']
  ],
  [
    ["regularization", "Regularization", 0, 'Technique used to penalize large coefficients in the regression model to prevent overfitting.']
  ],
  [
    ["k_neighbors", "K Neighbors Quantity", 0, 'Number of nearest neighbors considered when classifying or predicting a new point.']
  ],
  [
    ["kernel", "Kernel", 0, 'Function used to transform the data into a high-dimensional space where it becomes easier to separate classes with a hyperplane.'], 
    ["CParameter", "C Parameter", 0, 'Regularization parameter that controls the margin of error allowed for class separation.']
  ],
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
  const [actualStep, setActualStep] = useState(0);
  const [totalStep, setTotalStep] = useState(0);
  const [timeForEstimation, setTimeForEstimation] = useState(0);

  const [algorithmIndex, setAlgorithmIndex] = useState(0);

  const [executionType, setExecutionType] = useState("");
  const [useGetProgress, setUseGetProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


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
    setUseGetProgress(true);
    if(response) {
      await makeTraining(projectID, authTokens.access);

      return true;
    }
    return false;
  }

  const handleToCancelTraining = async() => {
    const response = await cancelTraining(projectID, authTokens.access);
    console.log(response);
    
    setTrained("false");
    setUseGetProgress(false);
    localStorage.removeItem(`progress_${projectID}`);
  } 

  const navigateToResults = () => {
    navigate(`/${projectID}/results`);
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
    console.log("TRAINING");

    // Realiza a busca do status da tarefa
    const responseTask = await checkTrainingStatus(
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
        setTrained("finished");
      }, 2000);
      localStorage.removeItem(`progress_${projectID}`);
    } else if(responseTask.state == 'FAILURE' || responseTask.state == 'ERROR') {
      setUseGetProgress(false);
      setTrained("error");

      const { error } = responseTask.result;
      setErrorMessage(error);

      alert("An error has occurred!");
      localStorage.removeItem(`progress_${projectID}`);
    }

    // Realiza a busca de progresso da tarefa
    const response = await getTrainingProgress(projectID, authTokens.access);
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
            route: 'training',
            progressValue: progress,
            maximumValue: maximum,
            counter: 0
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
    getTrainingSettings(projectID, authTokens.access)
    .then((response) => {
      setChoosenAlgorithm(response.algorithm);

      if(Object.keys(response.parameters).length) {
        setAlgorithmParameters(response.parameters);
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
      setWithFullSet(response.withFullSet);

      if(response.algorithmProgress) {
        setTrained("hide progress");
        setUseGetProgress(true);
      }
    })
    .catch(error => {
      console.log(error);
    })

  }, []);

  useEffect(() => {
    if(useGetProgress) {
      // A função será executada a cada quantidade de segundos
      const interval = setInterval(getProgress, delayTimeForGetProgress);
      // Função de limpeza para interromper o intervalo quando 
      // o componente for desmontado
      return () => clearInterval(interval);
    }
  }, [trained]);

  useEffect(() => {
    const index = algorithms.indexOf(choosenAlgorithm);
    setAlgorithmIndex(index);

  }, [choosenAlgorithm]);

  useEffect(() => {
  }, [withFullSet])

  useEffect(() => {
    updateStatus(projectID, authTokens.access, 'Training');
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

          <div className={styles.leftDiv}>
            <RadionInput 
              name={"Apply algorithm"}
              options={algorithms}
              setOption={setChoosenAlgorithm}
              firstOption={choosenAlgorithm}
              disabledInputs={disabledInputs}
            />
            <p>Without using full set</p>
          </div>

          <div className={styles.rightDiv}>
            <div className={styles.informationContainer}>
              <p className={styles.information}>
                {algorithmsDescriptions[algorithms.indexOf(choosenAlgorithm)]}
              </p>
            </div>
          </div>

        </div>

        <Button 
          name={'Back'} 
          URL={'/variables-selection'}
          stateToPass={{
            pageNumber: 3
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

        <div className={styles.container}>
          <div className={styles.leftDiv}>
            <div className={styles.parametersContainer}>
              {
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
          <div className={styles.rightDiv}>
            <div className={styles.informationContainer}>
              {
                algorithmsParameters[algorithmIndex].map((parameter, index) => {
                  return(
                    <p  key={index} className={styles.information}>
                      {`${parameter[1]}: ${parameter[3]}`}
                    </p>
                  )
                })
              }
            </div>
          </div>

        </div>

        {
          trained == "first time" &&
          <PopUp 
            show={true}
            title={"Training in progress..."}
            description={`The training with '${choosenAlgorithm}' is running!`}

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

            showSecondButton
            secondButtonName={"Cancel"}
            secondAction={handleToCancelTraining}
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
          trained == "error" &&
          <PopUp 
            show={true}
            title={"Training problem"}
            description={
              <>
                <p>
                  An internal server error prevented the training from being completed.
                </p>
                <p>
                  {errorMessage}
                </p>
              </>
            }

            showButton
            buttonName={"Fechar"}
            action={() => setTrained("false")}
          />
        }

        {
          trained == "finished" &&
          <PopUp 
            show={true}
            title={"Training completed"}
            description={
              `The training with '${choosenAlgorithm}' is finished! Click the button below to see the training results!`
            }

            showButton
            buttonName={"Results"}
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