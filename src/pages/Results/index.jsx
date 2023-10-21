import { UserBar } from '../../components/UserBar';
import { ProgressBar } from '../../components/ProgressBar';

import styles from './styles.module.css';

import { userName } from '../../settings';

export default function Results() {

  const href = '/results';
  const progress = 4;

  return(
    <>
      <UserBar name={userName}/>
      <ProgressBar progressNumber={progress}/>
    </>
  )
}