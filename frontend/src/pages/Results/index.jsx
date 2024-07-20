import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';
import { Graph } from '../../components/Graph';
import Button from '../../components/Button';

import styles from './styles.module.css';

import { statesProgressBar } from '../../settings';

import { getTrainingGraphs } from '../../api/training';
import { updateStatus } from '../../api/project';

import { DownloadSimple } from '@phosphor-icons/react';

import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';
import TableResult from '../../components/TableResult';

export default function Results() {

  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);
  const { projectID } = useParams();

  const progress = 4;
  const location = useLocation();
  const state = location.state;
  
  let pageNumber = 0;
  if(state) {
    if(state.pageNumber) {
      pageNumber = state.pageNumber;
    }
  }

  const [graphs, setGraphs] = useState([]);

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
      setGraphs(graphs);
    })
    .catch((error) => {
      console.log(error);
    })
  }, [])

  useEffect(() => {
    updateStatus(projectID, authTokens.access, 'Resultados');
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
          pageNumber != 4
          ? (
              graphs.length && graphs[pageNumber]
              ?
                <div className={styles.graphContainer}>
                  <Graph 
                    width={600}
                    image={graphs[pageNumber]}
                  />
                  <a
                    className={styles.downloadButton}
                    onClick={() => downloadGraph(graphs[pageNumber])}
                  >
                    <DownloadSimple size={30} color='var(--black-color-1)' />
                  </a>
                </div>
              :
                undefined
          )
          :
            <TableResult />
        }
        
        

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
              URL={'/prevision'}
              stateToPass={{
                pageNumber: 0
              }}
              side={'right'}
            />
          </>
      }
    </>
  )
}