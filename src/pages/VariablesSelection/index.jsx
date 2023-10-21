import { UserBar } from '../../components/UserBar';
import { ProgressBar } from '../../components/ProgressBar';

import styles from './styles.module.css';

import { userName } from '../../settings';

export default function VariablesSelection() {

  const href = '/variables-selection';
  const progress = 2;

  return(
    <>
      <UserBar name={userName}/>
      <ProgressBar progressNumber={progress}/>
    </>
  )
}