import { ProgressBar } from '../../components/ProgressBar';
import { UserBar } from '../../components/UserBar';
import { DefaultPage } from '../DefaultPage';

import styles from './styles.module.css';

export function Project() {
  return(
    <DefaultPage>
      <UserBar name={"Daniel Alencar"}/>
      <ProgressBar />
    </DefaultPage>
  )
}