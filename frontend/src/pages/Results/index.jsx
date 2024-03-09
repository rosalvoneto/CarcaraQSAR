import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';
import { Graph } from '../../components/Graph';
import Button from '../../components/Button';
import { Tabs } from '../../components/Tabs';

import styles from './styles.module.css';

import { statesProgressBar } from '../../settings';

import { getTrainingGraphs } from '../../api/training';

import Graph1 from '../../assets/results/graph1.png';
import Graph2 from '../../assets/results/graph2.png';
import Graph3 from '../../assets/results/graph3.png';
import Graph4 from '../../assets/results/graph4.png';
import Graph5 from '../../assets/results/graph5.png';

import Graph6 from '../../assets/results/graph1.png';
import Graph7 from '../../assets/results/graph2.png';
import Graph8 from '../../assets/results/graph3.png';
import Graph9 from '../../assets/results/graph4.png';
import Graph10 from '../../assets/results/graph5.png';

import { DownloadSimple } from '@phosphor-icons/react';

import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';

const graphsWithoutExternalSet = [Graph1, Graph2, Graph3, Graph4, Graph5];
const graphsWithExternalSet = [Graph6, Graph7, Graph8, Graph9, Graph10];

const graphs = [
  graphsWithoutExternalSet,
  graphsWithExternalSet
];

export default function Results() {

  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);
  const { projectID } = useParams();

  const href = '/results';
  const progress = 4;
  const location = useLocation();
  const state = location.state;
  
  const tabsNames = ["Sem conjunto externo", "Com conjunto externo"];
  let pageNumber = 0;
  if(state) {
    if(state.pageNumber) {
      pageNumber = state.pageNumber;
    }
  }

  const [selectedTab, setSelectedTab] = useState(0);
  const [graphsWithoutFullSet, setGraphsWithoutFullSet] = useState([null]);
  const [graphsWithFullSet, setGraphsWithFullSet] = useState([null]);

  const downloadGraph = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;

    // Nome do arquivo de download
    if(pageNumber == 0) {
      link.download = 'importance.jpg';
    } else if(pageNumber == 1) {
      link.download = 'leave_one_out.jpg';
    } else if(pageNumber == 2) {
      link.download = 'k-fold_cross_validation.jpg';
    } else if(pageNumber == 3) {
      link.download = 'y-scrambling.jpg';
    } else if(pageNumber == 4) {
      link.download = 'bootstrap.jpg';
    } else {
      link.download = 'undefined.jpg';
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    getTrainingGraphs(projectID, authTokens.access)
    .then((graphs) => {
      console.log(graphs);
      setGraphsWithoutFullSet(graphs);
    })
    .catch((error) => {
      console.log(error);
    })
  }, [])

  return(
    <>
      <Header 
        title={projectDetails.name}
      />
      <ProgressBar 
        progressNumber={progress}
        subProgressNumber={pageNumber}
      />

      <div className={styles.container}>

        {
        /*
          <Tabs 
            tabs={tabsNames} 
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        */
        }

        <div className={styles.graphContainer}>
          <Graph 
            width={
              pageNumber == 0
              ? 800
              : 600
            }
            image={
              selectedTab == 0
              ? graphsWithoutFullSet[pageNumber]
              : graphsWithFullSet[pageNumber]
            }
          />
          <a
            className={styles.downloadButton}
            onClick={
              () => downloadGraph(
                selectedTab == 0
                ? graphsWithoutFullSet[pageNumber]
                : graphsWithFullSet[pageNumber]
              )
            }
          >
            <DownloadSimple size={30} color='var(--black-color-1)' />
          </a>
        </div>

      </div>

      {
        statesProgressBar[progress].childs.length > (pageNumber + 1)
        ?
          <>
            <Button 
              name={'Voltar'} 
              URL={
                pageNumber
                ?
                  '/results'
                :
                  '/training'
              }
              stateToPass={
                pageNumber
                ?
                  { pageNumber: pageNumber - 1 }
                :
                  { pageNumber: 1 }
              }
              side={'left'}
            />
            <Button 
              name={'Próximo'} 
              URL={'/results'}
              stateToPass={{
                pageNumber: pageNumber + 1
              }}
              side={'right'}
            />
          </>
        :
          <>
            <Button 
              name={'Voltar'} 
              URL={'/results'}
              stateToPass={{
                pageNumber: pageNumber - 1
              }}
              side={'left'}
            />
            <Button 
              name={'Próximo'} 
              URL={'/home'}
              useStrictURL={true}
              side={'right'}
            />
          </>
      }
    </>
  )
}