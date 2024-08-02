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
  train,
  getTrainingProgress,
  setTrainingProgress, 
} from '../../api/training';

import { updateStatus } from '../../api/project';

import Loading from '../../components/Loading';

import { delayTimeForGetProgress } from '../../settings';

export const algorithms = [
  "Random Forest",
  "Regressão linear",
  "KNN",
  "Support Vector Machines (SVM)",
];
const disabledInputs = [1, 2, 3];

export const algorithmsDescriptions = [
  "O algoritmo Random Forest é um método de aprendizado de máquina que combina múltiplas árvores de decisão para tomar decisões mais precisas e estáveis. Ele funciona criando um conjunto de árvores de decisão, cada uma treinada em uma amostra aleatória dos dados e usando diferentes conjuntos de recursos. Ao fazer previsões, as árvores votam em conjunto, e a classe ou valor com mais votos é escolhido como a previsão final. Isso reduz a tendência de overfitting e melhora a robustez do modelo.",
  "A regressão linear é um algoritmo de aprendizado de máquina supervisionado usado para modelar a relação entre uma variável independente (ou mais) e uma variável dependente, geralmente de natureza contínua. Ele assume que a relação entre as variáveis pode ser representada por uma linha reta, daí o termo 'linear'. O objetivo é encontrar os coeficientes que melhor ajustam essa linha aos dados, de modo a minimizar a diferença entre as previsões do modelo e os valores reais.",
  "O algoritmo KNN (K-Nearest Neighbors) é uma técnica simples e poderosa no campo da aprendizagem de máquina. Sua simplicidade é uma de suas principais vantagens, tornando-o fácil de entender e implementar. Ele opera no princípio de 'vizinhos mais próximos', onde as decisões são baseadas na proximidade dos pontos de dados no espaço de características.",
  "As Máquinas de Vetores de Suporte são algoritmos de aprendizado de máquina que são usados tanto em tarefas de classificação quanto de regressão. O SVM busca encontrar um hiperplano que melhor separa as classes em um espaço multidimensional, maximizando a margem entre as classes. Isso torna o SVM eficaz na classificação de dados não lineares e na manipulação de dados com dimensionalidade elevada. Além disso, os SVMs podem fazer uso de truques de kernel para transformar dados em espaços de características mais complexos e, assim, abordar problemas de classificação mais desafiadores."
]

export const algorithmsParameters = [
  [
    ["n_estimators", "Número de árvores", 50, 'Quantidade de árvores de decisão que serão criadas no modelo de Random Forest.'], 
    ["max_features", "Quantidade de features", 5, 'Número de características (ou variáveis) selecionadas aleatoriamente para considerar ao dividir um nó em cada árvore.']
  ],
  [
    ["regularization", "Regularização", 0, 'Técnica usada para penalizar coeficientes grandes no modelo de regressão para prevenir overfitting.']
  ],
  [
    ["k_neighbors", "Quantidade K de vizinhos", 0, 'Número de vizinhos mais próximos considerados ao classificar ou prever um novo ponto.']
  ],
  [
    ["kernel", "Kernel", 0, 'Função usada para transformar os dados em um espaço de alta dimensão onde se torna mais fácil separar as classes com um hiperplano.'], 
    ["CParameter", "Parâmetro C", 0, 'Parâmetro de regularização que controla a margem de erro permitida para a separação das classes.']
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

  const [executionType, setExecutionType] = useState("");

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
        // Atualizar progresso
        setProgressValue(100);
        setMaximumValue(100);
        setTimeout(() => {
          alert("Finalizou!");
          setTrained("finished");
        }, 2000);

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
      console.log(response);

      if(response.progress) {
        const split = response.progress.split('/');
        const progress = Number(split[0]);
        const maximum = Number(split[1]);
        const actualStep = Number(split[2]);
        const totalStep = Number(split[3]);

        if(progress >= 0) {
          // Atualizar progresso
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
              name={"Aplicar algoritmo"}
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
            <p>Sem o uso de conjunto completo</p>
            
          </div>
          
          <div className={styles.informationContainer}>
            <p className={styles.information}>
              {algorithmsDescriptions[algorithms.indexOf(choosenAlgorithm)]}
            </p>
          </div>

        </div>

        <Button 
          name={'Voltar'} 
          URL={'/variables-selection'}
          stateToPass={{
            pageNumber: 2
          }}
          side={'left'}
        />
        <Button 
          name={'Próximo'} 
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
                  Salvar e Treinar
                </button>
              :
                <button 
                  onClick={() => {
                    setTrained("show progress");
                  }}
                  className={styles.button}
                >
                  Mostrar progresso
                </button>
            }
          </div>
          <div className={styles.parametersDescriptionsContainer}>
            {
              algorithmsParameters[algorithmIndex].map(parameter => {
                return(
                  <p className={styles.information}>
                    {`${parameter[1]}: ${parameter[3]}`}
                  </p>
                )
              })
            }
          </div>

        </div>

        {
          trained == "first time" &&
          <PopUp 
            show={true}
            title={"Treinamento em andamento..."}
            description={`O treinamento com o algoritmo ${choosenAlgorithm} está sendo executado!`}

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
            title={"Treinando..."}

            showButton
            buttonName={"Fechar"}
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
                  executionType.length
                  ? `Processo ${actualStep}/${totalStep}: ${executionType}`
                  : undefined
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
          trained == "error" &&
          <PopUp 
            show={true}
            title={"Problema no treinamento"}
            description={
              `Um erro interno do servidor não permitiu concluir o treinamento.`
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
            title={"Treinamento finalizado"}
            description={
              `O treinamento com o algoritmo ${choosenAlgorithm} está finalizado! Clique no botão abaixo para ver os resultados do treinamento!`
            }

            showButton
            buttonName={"Ver resultados"}
            action={navigateToResults}
          />
        }

        <Button 
          name={'Voltar'} 
          URL={'/training'}
          stateToPass={{
            pageNumber: 0
          }}
          side={'left'}
        />
        {
          trained == "finished" &&
          <Button 
            name={'Próximo'} 
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