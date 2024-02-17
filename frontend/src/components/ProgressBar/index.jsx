
import { useEffect, useState } from 'react';

import { statesProgressBar } from '../../settings';

import { Block } from './Block';

import styles from './styles.module.css';

export function ProgressBar({ progressNumber, subProgressNumber }) {

  const [progress, setProgress] = useState(progressNumber);
  const [subProgress, setSubProgress] = useState(subProgressNumber);

  return(
    <div className={styles.container}>
      <div className={styles.barContainer}>
        {
          statesProgressBar.map((state, index) => {

            const useImage = index != (statesProgressBar.length - 1);

            return(
              <Block 
                key={index} 
                state={state} 
                useImage={useImage}
                progress={progressNumber}
              />
            );

          })
        }
      </div>
      <div className={styles.barContainer}>
        {
          statesProgressBar[progressNumber].childs.map((state, index) => {
          
            const childLength = statesProgressBar[progressNumber].childs.length;
            const useImage = index != (childLength - 1);

            return(
              <Block 
                key={index} 
                state={state} 
                useImage={useImage}
                progress={subProgressNumber}
              />
            );
  
          })
        }
      </div> 
    </div>
  )
}