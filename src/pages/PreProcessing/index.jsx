import { DefaultPage } from '../DefaultPage';
import { UserBar } from '../../components/UserBar';

import { ProgressBar } from '../../components/ProgressBar';
import { statesProgressBar, userName } from '../../settings';

import { DataTable } from '../../components/DataTable';

import Histograma from '../../assets/histograma.png';
import BoxPlot from '../../assets/box-plot.png';

import styles from './styles.module.css';
import { Graph } from '../../components/Graph';

export function PreProcessing() {

  const href = '/pre-processing';
  const progress = 1;

  return(
    <>
      <UserBar name={userName} />
      <ProgressBar progressNumber={progress}/>

      <div className={styles.container}>
        <DataTable vertical={true} onlyTitles/>

        <div className={styles.graphsContainer}>

          <Graph name={"Histograma"} image={Histograma}/>
          <Graph name={"Box-Plot"} image={BoxPlot}/>

        </div>

      </div>
    </>
  )
}