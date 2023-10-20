import { ProgressBar } from '../../components/ProgressBar';
import { UserBar } from '../../components/UserBar';
import { DefaultPage } from '../DefaultPage';

import styles from './styles.module.css';

export function Project() {
  return(
    <DefaultPage>
      <UserBar name={"Daniel Alencar"}/>
      <ProgressBar />

      <div className={styles.inlineInputContainer}>
        <p className={styles.descritptor}>Tipo de separador: </p>
        <input type="text" className={styles.input} />
      </div>
      <div className={styles.uploadContainer}>
        <p className={styles.uploadDescription}>
          Upload (CSV, TXT)
        </p>
      </div>

    </DefaultPage>
  )
}