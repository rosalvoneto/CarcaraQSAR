import { useState } from 'react';

import { DataTable } from '../../components/DataTable';
import { ProgressBar } from '../../components/ProgressBar';
import { UserBar } from '../../components/UserBar';
import { DefaultPage } from '../DefaultPage';

import styles from './styles.module.css';

export function Project() {

  const [transpose, setTranspose] = useState(false);

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

      <div className={styles.containerInput}>
        <p className={styles.descritptorInput}>Trasposição:</p>
        <input 
          type="checkbox" 
          className={styles.inputCheck}
          checked={transpose} 
          onClick={() => setTranspose(!transpose)} 
        />
      </div>

      <DataTable vertical={transpose}/>
    </DefaultPage>
  )
}