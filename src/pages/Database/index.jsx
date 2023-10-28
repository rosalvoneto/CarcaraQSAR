import { useEffect, useState } from 'react';

import { DataTable } from '../../components/DataTable';
import { ProgressBar } from '../../components/ProgressBar';
import { Header } from '../../components/Header';
import { DefaultPage } from '../DefaultPage';
import { CheckboxInput } from '../../components/CheckboxInput';

import styles from './styles.module.css';

import { projectName, userName } from '../../settings';
import { InlineInput } from '../../components/InlineInput';
import Button from '../../components/Button';

export function Database() {

  const href = '/database';
  const progress = 0;
  const subProgress = 0;

  const [transpose, setTranspose] = useState(false);

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

      <InlineInput name={"Tipo de separador"}/>
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

      <Button 
        name={'Próximo'} 
        URL={'/pre-processing'} 
        stateToPass={{
          pageNumber: 0
        }}
      />
    </>
  )
}