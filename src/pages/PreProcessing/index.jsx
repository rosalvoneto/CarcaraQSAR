import { DefaultPage } from '../DefaultPage';
import { UserBar } from '../../components/UserBar';

import { ProgressBar } from '../../components/ProgressBar';
import { statesProgressBar, userName } from '../../settings';

import styles from './styles.module.css';

export function PreProcessing() {

  const href = '/pre-processing';
  const progress = 1;

  return(
    <>
      <UserBar name={userName} />
      <ProgressBar progressNumber={progress}/>
    </>
  )
}