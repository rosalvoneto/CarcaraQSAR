import { useEffect, useState } from 'react';

import { DataTable } from '../../components/DataTable';
import { ProgressBar } from '../../components/ProgressBar';
import { UserBar } from '../../components/UserBar';
import { DefaultPage } from '../DefaultPage';
import { CheckboxInput } from '../../components/CheckboxInput';

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

      <div className={styles.tableInfomation}>
        <CheckboxInput value={transpose} setValue={setTranspose}/>
        <p className={styles.tableDescription}>
          4000 linhas x 30 colunas
        </p>
      </div>

      <DataTable vertical={transpose}/>
    </DefaultPage>
  )
}