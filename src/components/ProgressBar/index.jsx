
import { useState } from 'react';

import { statesProgressBar } from '../../settings';

import { useNavigate } from 'react-router-dom';
import { Block } from './Block';

import styles from './styles.module.css';

export function ProgressBar({ progressNumber }) {

  const [progress, setProgress] = useState(progressNumber);
  const navigate = useNavigate();

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
                progress={progress}
              />
            );

          })
        }
      </div>
      {
      /* 
      <div className={styles.barContainer}>
        {
          statesProgressBar[Math.floor(progress)].childs.length != 0 &&
          statesProgressBar[Math.floor(progress)].childs.map((state, index) => {
          
            const childLength = statesProgressBar[Math.floor(progress)].childs.length;
            const useImage = index != (childLength - 1);
            return(
              <Block key={index} state={state} useImage={useImage}/>
            );
  
          })
        }
      </div> 
      */
      }
    </div>
  )
}