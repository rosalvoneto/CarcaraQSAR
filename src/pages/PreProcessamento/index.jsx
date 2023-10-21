import { DefaultPage } from '../DefaultPage';
import { UserBar } from '../../components/UserBar';

import { ProgressBar } from '../../components/ProgressBar';
import { userName } from '../../settings';

import styles from './styles.module.css';

export function PreProcessamento() {

  const progress = 2;

  return(
    <DefaultPage>
      <UserBar name={userName} />
      <ProgressBar />
    </DefaultPage>
  )
}