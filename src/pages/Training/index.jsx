import { ProgressBar } from '../../components/ProgressBar';
import { UserBar } from '../../components/UserBar';

import styles from './styles.module.css';

import { userName } from '../../settings';

export default function Training() {

  const href = '/training';
  const progress = 3;

  return(
    <>
      <UserBar name={userName}/>
      <ProgressBar progressNumber={progress}/>
    </>
  )
}