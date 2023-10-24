import { ProgressBar } from '../../components/ProgressBar';
import { UserBar } from '../../components/UserBar';

import styles from './styles.module.css';

import { userName } from '../../settings';
import { RadionInput } from '../../components/RadioInput';
import { useEffect, useState } from 'react';
import { InlineInput } from '../../components/InlineInput';

export const bioAlgorithms = [
  "Random Forest",
  "Regressão linear",
  "Regressão logística",
  "Support Vector Machines (SVM)",
];

export const bioAlgorithmsDescriptions = [
  "O algoritmo Random Forest é um método de aprendizado de máquina que combina múltiplas árvores de decisão para tomar decisões mais precisas e estáveis. Ele funciona criando um conjunto de árvores de decisão, cada uma treinada em uma amostra aleatória dos dados e usando diferentes conjuntos de recursos. Ao fazer previsões, as árvores votam em conjunto, e a classe ou valor com mais votos é escolhido como a previsão final. Isso reduz a tendência de overfitting e melhora a robustez do modelo.",
  "A regressão linear é um algoritmo de aprendizado de máquina supervisionado usado para modelar a relação entre uma variável independente (ou mais) e uma variável dependente, geralmente de natureza contínua. Ele assume que a relação entre as variáveis pode ser representada por uma linha reta, daí o termo 'linear'. O objetivo é encontrar os coeficientes que melhor ajustam essa linha aos dados, de modo a minimizar a diferença entre as previsões do modelo e os valores reais.",
  "A regressão logística é um algoritmo de aprendizado de máquina usado para problemas de classificação, onde o objetivo é prever a probabilidade de uma instância pertencer a uma classe específica. Ele modela a relação entre variáveis independentes e a probabilidade de pertencer a uma classe usando uma função logística. A saída da regressão logística está no intervalo de 0 a 1 e pode ser interpretada como a probabilidade de pertencimento à classe.",
  "As Máquinas de Vetores de Suporte são algoritmos de aprendizado de máquina que são usados tanto em tarefas de classificação quanto de regressão. O SVM busca encontrar um hiperplano que melhor separa as classes em um espaço multidimensional, maximizando a margem entre as classes. Isso torna o SVM eficaz na classificação de dados não lineares e na manipulação de dados com dimensionalidade elevada. Além disso, os SVMs podem fazer uso de truques de kernel para transformar dados em espaços de características mais complexos e, assim, abordar problemas de classificação mais desafiadores."
]

export default function Training() {

  const href = '/training';
  const progress = 3;

  const [option, setOption] = useState(bioAlgorithms[0]);

  useEffect(() => {
    console.log(option)
  }, [option]);

  if(false) {
    return(
      <>
        <UserBar name={userName}/>
        <ProgressBar progressNumber={progress}/>

        <div className={styles.container}>

          <RadionInput 
            name={"Aplicar algoritmo BioInspirado"}
            options={bioAlgorithms}
            setOption={setOption}
          />
          <div className={styles.informationContainer}>
            <p className={styles.information}>
              {bioAlgorithmsDescriptions[bioAlgorithms.indexOf(option)]}
            </p>
          </div>

        </div>
      </>
    )
  } else {
    return(
      <>
        <UserBar name={userName}/>
        <ProgressBar progressNumber={progress}/>

        <div className={styles.parametersContainer}>

          <InlineInput name={"Quantidade de árvores: "}/>
          <InlineInput name={"Número de atributos por árvore: "}/>

        </div>
      </>
    )
  }
}