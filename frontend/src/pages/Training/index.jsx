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
  getTrainingSettings, setTrainingSettings, train 
} from '../../api/training';

import { updateStatus } from '../../api/project';

import Loading from '../../components/Loading';
import ProgressContext from '../../context/ProgressContext';

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
  [["n_estimators", "Número de árvores"], ["max_features", "Quantidade de features"]],
  [["regularization", "Regularização"]],
  [["k_neighbors", "Quantidade K de vizinhos"]],
  [["kernel", "Kernel"], ["CParameter", "Parâmetro C"]],
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

  let delayTimeForGetProgress = 5000;

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
  const [counterInProgress, setCounterInProgress] = useState(0);

  const [algorithmIndex, setAlgorithmIndex] = useState(0);

  const { updateProgressExecutions } = useContext(ProgressContext);

  const changeParameters = (key, value) => {
    let values = algorithmParameters;
    values[key] = value;
    setAlgorithmParameters(values);

    console.log(values);
  }

  const nextActionButton = async() => {
    const trainingSettings = await getTrainingSettings(projectID, authTokens.access);

    if(
      trainingSettings.algorithm == choosenAlgorithm && 
      trainingSettings.withFullSet == withFullSet
      ) {
      console.log("O algoritmo não mudou");
      console.log("A configuração de conjunto completo não mudou");
      console.log("Não precisa modificar!");
      return true;

    } else {
      console.log("Algo mudou, precisa modificar!");
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
      } else {
        setTrained("finished");
      }

      return true;
    }
    return false;
  }

  const navigateToResults = () => {
    navigate(`/${projectID}/results`);
  }

  const makeEstimation = (counterInProgress, progress, maximum, progressRange) => {
    let timeForProgressAtual = counterInProgress * delayTimeForGetProgress;
    
    const progressRestante = (maximum - progress);
    const progressAtual = progressRange;
    
    console.log("Fazendo estimativa...");
    console.log(counterInProgress);
    console.log(progressRestante);
    console.log(progressAtual);
    
    let estimation = (progressRestante * timeForProgressAtual) / progressAtual;
    estimation = estimation / 3600;
    console.log(estimation);
    
    setCounterInProgress(0);
    setTimeForEstimation(Math.ceil(estimation));
  }

  const getProgress = async() => {
    if(trained != "false") {
      const response = await getTrainingProgress(projectID, authTokens.access);
      if(response.progress) {
        const split = response.progress.split('/');
        const progress = Number(split[0]);
        const maximum = Number(split[1]);

        // Fazer estimativa de tempo restante
        if(progress >= 0) {
          console.log("Contador do progresso:", counterInProgress + 1);
          
          if(progress != progressValue) {
            makeEstimation(counterInProgress + 1 ,progress, maximum, progress - progressValue);
            
            // Atualizar progresso
            setProgressValue(progress);
            setMaximumValue(maximum);

            // Atualizar progresso no contexto
            updateProgressExecutions(
              projectID,
              'training',
              progress,
              maximum,
            )
          }

          setCounterInProgress(counterInProgress + 1);
        }
      }
    }
  }

  useEffect(() => {
    getTrainingSettings(projectID, authTokens.access)
    .then((response) => {
      console.log(response.algorithm);
      setChoosenAlgorithm(response.algorithm);

      console.log(response.parameters);
      setAlgorithmParameters(response.parameters);

      console.log(response.withFullSet);
      setWithFullSet(response.withFullSet);

      if(response.algorithmProgress) {
        console.log(response.algorithmProgress);
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
    console.log("Índice do algoritmo:", index);
    setAlgorithmIndex(index);

  }, [choosenAlgorithm]);

  useEffect(() => {
    console.log("Valor do check:", withFullSet);
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