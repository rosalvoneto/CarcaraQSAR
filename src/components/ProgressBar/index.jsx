
import { useState } from 'react';

import { statesProgressBar } from '../../settings';
import { CaretRight } from '@phosphor-icons/react';

import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

export function ProgressBar({ progressNumber }) {
  const [progress, setProgress] = useState(progressNumber);

  const navigate = useNavigate();

  const activateState = (state) => {
    setProgress(state.index);
    navigate(state.href);
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
          statesProgressBar.map((state, index) => {

            const useImage = index != (statesProgressBar.length - 1);
            return(
              block(state, useImage)
            );

          })
        }
      </div>
      <div className={styles.barContainer}>
        {
          statesProgressBar[Math.floor(progress)].childs.length != 0 &&
          statesProgressBar[Math.floor(progress)].childs.map((state, index) => {
          
            const childLength = statesProgressBar[Math.floor(progress)].childs.length;
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