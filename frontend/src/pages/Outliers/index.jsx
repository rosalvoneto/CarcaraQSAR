import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';
import Button from '../../components/Button';

import styles from './styles.module.css';

import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';

export default function Outliers() {

  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);
  const { projectID } = useParams();

  const href = '/outliers';
  const progress = 5;
  const subProgress = 0;

  return(
    <>
      <Header 
        title={projectDetails.name}
      />
      <ProgressBar 
        progressNumber={progress}
        subProgressNumber={subProgress}
      />

      <Button 
        name={'Voltar'} 
        URL={'/results'}
        stateToPass={{
          pageNumber: 4
        }}
        side={'left'}
      />
      <Button 
        name={'Finalizar'} 
        URL={'/home'}
        useStrictURL={true}
        side={'right'}
      />
    </>
  )
}