import { useState } from 'react';
import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';

import styles from './styles.module.css';

import { projectName, userName } from '../../settings';
import { RadionInput } from '../../components/RadioInput';
import Button from '../../components/Button';

export const algorithms = [
  "Colônia de formigas",
  "Algoritmo genético",
  "Colônia de abelhas",
  "Cardume de peixes",
  "NÃO APLICAR"
];

export const algorithmsDescriptions = [
  "O algoritmo de Colônia de Formigas é inspirado no comportamento de formigas reais que comunicam e colaboram para encontrar caminhos mais curtos entre a fonte de comida e o ninho. Neste algoritmo, agentes virtuais imitam esse comportamento, deixando trilhas de feromônios para indicar rotas eficazes, criando uma solução otimizada para problemas de otimização, como o Problema do Caixeiro Viajante.",
  "Os Algoritmos Genéticos são uma técnica de otimização baseada na seleção natural e genética. Eles operam em populações de soluções candidatas e utilizam operadores genéticos, como mutação e cruzamento, para evoluir e melhorar essas soluções ao longo de várias gerações. Esses algoritmos são amplamente usados para encontrar soluções aproximadas para problemas complexos de otimização e busca.",
  "Inspirado no comportamento de colônias de abelhas, o Algoritmo de Colônia de Abelhas é uma técnica de otimização baseada na exploração de soluções candidatas em um espaço de busca. Abelhas virtuais procuram soluções em locais específicos e compartilham informações sobre a qualidade das soluções encontradas com outras abelhas, permitindo a convergência para uma solução ótima em problemas de otimização complexos.",
  "O Algoritmo de Cardume de Peixes, também conhecido como Algoritmo de Otimização de Cardume, é uma técnica inspirada no comportamento de peixes em um cardume. Os indivíduos virtuais (peixes) ajustam sua posição e velocidade com base nas posições e movimentos dos vizinhos, colaborando para encontrar soluções otimizadas para problemas de otimização multidimensional, como a busca por ótimos locais em espaços de busca complexos.",
  "Nenhum algortimo foi escolhido"
]

export default function VariablesSelection() {

  const href = '/variables-selection';
  const progress = 2;

  const [option, setOption] = useState(algorithms[0]);

  return(
    <>
      <Header 
        title={projectName}
        userName={userName}
      />
      <ProgressBar progressNumber={progress}/>
      <div className={styles.container}>
        <div className={styles.algorithmContainer}>
          <RadionInput 
            name={"Aplicar algoritmo BioInspirado"}
            options={algorithms}
            setOption={setOption}
          />
          <div className={styles.informationContainer}>
            <p className={styles.information}>
              { algorithmsDescriptions[algorithms.indexOf(option)] }
            </p>
          </div>
        </div>

        <RadionInput 
          name={"Remover automaticamente variáveis constantes"}
          options={["Sim", "Não"]}
        />
      </div>

      <Button 
        name={'Próximo'} 
        URL={'/training'} 
        stateToPass={{
          pageNumber: 0
        }}
      />
    </>
  )
}