import { useLocation } from 'react-router-dom';

import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';
import { Graph } from '../../components/Graph';
import Button from '../../components/Button';
import { Tabs } from '../../components/Tabs';

import styles from './styles.module.css';

import { userName, statesProgressBar, projectName } from '../../settings';

import Graph1 from '../../assets/results/graph1.png';
import Graph2 from '../../assets/results/graph2.png';
import Graph3 from '../../assets/results/graph3.png';
import Graph4 from '../../assets/results/graph4.png';
import Graph5 from '../../assets/results/graph5.png';

const graphs = [Graph1, Graph2, Graph3, Graph4, Graph5];

export default function Results() {

  const href = '/results';
  const progress = 4;

  const tabsNames = ["Sem conjunto externo", "Com conjunto externo"];

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
      <Header 
        title={projectName}
        userName={userName}
      />
      <ProgressBar 
        progressNumber={progress}
        subProgressNumber={pageNumber}
      />

      <div className={styles.container}>
        <Tabs tabs={tabsNames} />
        <Graph 
          width={550}
          image={graphs[pageNumber]}
        />
      </div>

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
    </>
  )
}