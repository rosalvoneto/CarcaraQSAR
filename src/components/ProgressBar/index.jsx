
import { useState } from 'react';

import { CaretRight } from '@phosphor-icons/react';

import styles from './styles.module.css';

export function ProgressBar() {

  const states = [
    {
      index: 0,
      name: "Base de Dados"
    },
    {
      index: 1,
      name: "Pré-processamento"
    },
    {
      index: 2,
      name: "Seleção de Variáveis"
    },
    {
      index: 3,
      name: "Treinamento"
    },
    {
      index: 4,
      name: "Resultados"
    },
    {
      index: 5,
      name: "Outliers"
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
          onClick={() => activateState(state)}
        >
          {state.name}
        </p>
        {
          useImage &&
          <div className={classNamesImage}>
            <CaretRight size={22} color={colorCaretRight} />
          </div>
        }
      </div>
    )
  }

  return(
    <div className={styles.container}>
      {
        states.map((state, index) => {

          const useImage = index != (states.length - 1);
          return(
            block(state, useImage)
          );

        })
      }
    </div>
  )
}