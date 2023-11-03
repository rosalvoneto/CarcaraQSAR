import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';

import styles from './styles.module.css';

import { projectName, userName } from '../../settings';
import Button from '../../components/Button';

export default function Outliers() {

  const href = '/outliers';
  const progress = 5;
  const subProgress = 0;

  return(
    <>
      <Header 
        title={projectName}
        userName={userName}
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
        side={'right'}
      />
    </>
  )
}