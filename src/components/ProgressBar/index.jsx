
import { useState } from 'react';

import { CaretRight } from '@phosphor-icons/react';

import styles from './styles.module.css';

export function ProgressBar() {

  const states = [
    {
      index: 0,
      name: "Base de Dados",
      childs: []
    },
    {
      index: 1,
      name: "Pré-processamento",
      childs: [
        {
          index: 1.1,
          name: "Estatística descritiva",
          childs: []
        },
        {
          index: 1.2,
          name: "Normalização dos dados",
          childs: []
        },
      ]
    },
    {
      index: 2,
      name: "Seleção de Variáveis",
      childs: []
    },
    {
      index: 3,
      name: "Treinamento",
      childs: [
        {
          index: 3.1,
          name: "Algoritmo",
          childs: []
        },
        {
          index: 3.2,
          name: "Hiperparâmetros",
          childs: []
        },
      ]
    },
    {
      index: 4,
      name: "Resultados",
      childs: [
        {
          index: 4.1,
          name: "Importância das variáveis",
          childs: []
        },
        {
          index: 4.2,
          name: "Leave One Out",
          childs: []
        },
        {
          index: 4.3,
          name: "K-Fold Cross Validation",
          childs: []
        },
        {
          index: 4.4,
          name: "Y-Scrambling",
          childs: []
        },
        {
          index: 4.5,
          name: "Bootstrap",
          childs: []
        },
      ]
    },
    {
      index: 5,
      name: "Outliers",
      childs: []
    },
  ];
  const [progress, setProgress] = useState(0);

  const activateState = (state) => {
    setProgress(state.index);
  }

  const block = (state, useImage) => {
    const activeText = state.index <= progress;
    const activeImage = state.index < progress;

    const classNamesText = `${styles.text} ${
      activeText
      ? styles.activatedText
      : styles.deactivatedText
    }`;

    const classNamesImage = `${styles.image} ${
      activeImage
      ? styles.activatedImage
      : styles.deactivatedImage
    }`;

    const colorCaretRight = activeImage ? 
      'var(--white-color-1)' : 'var(--black-color-1)';

    return(
      <div key={state.index} style={{ display: 'flex' }}>
        <p 
          className={classNamesText}
          style={Math.floor(state.index) != state.index ? { fontSize: 12 } : {}}
          onClick={() => activateState(state)}
        >
          {state.name}
        </p>
        {
          useImage &&
          <div className={classNamesImage}>
            <CaretRight size={16} color={colorCaretRight} />
          </div>
        }
      </div>
    )
  }

  return(
    <div className={styles.container}>
      <div className={styles.barContainer}>
        {
          states.map((state, index) => {

            const useImage = index != (states.length - 1);
            return(
              block(state, useImage)
            );

          })
        }
      </div>
      <div className={styles.barContainer}>
        {
          states[Math.floor(progress)].childs.length != 0 &&
          states[Math.floor(progress)].childs.map((state, index) => {
          
            const childLength = states[Math.floor(progress)].childs.length;
            const useImage = index != (childLength - 1);
            return(
              block(state, useImage)
            );
  
          })
        }
      </div>
    </div>
  )
}