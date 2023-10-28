import { UserBar } from '../../components/UserBar';
import { ProgressBar } from '../../components/ProgressBar';

import styles from './styles.module.css';

import { userName, statesProgressBar } from '../../settings';
import { Graph } from '../../components/Graph';

import GraphImage from '../../assets/results/importancia_das_variaveis.png';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

export default function Results() {

  const href = '/results';
  const progress = 4;

  const location = useLocation();
  const state = location.state;

  let pageNumber = 0;
  if(state) {
    if(state.pageNumber) {
      pageNumber = state.pageNumber;
    }
  }

  return(
    <>
      <UserBar name={userName}/>
      <ProgressBar 
        progressNumber={progress}
        subProgressNumber={pageNumber}
      />

      <div className={styles.container}>
        <Graph image={GraphImage} width={600}/>

        {
          statesProgressBar[progress].childs.length > (pageNumber + 1)
          ?
            <Button 
              name={'Próximo'} 
              URL={'/results'}
              stateToPass={{
                pageNumber: pageNumber + 1
              }}
            />
          :
            <Button 
              name={'Próximo'} 
              URL={'/outliers'}
            />
        }
        
      </div>
    </>
  )
}