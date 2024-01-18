import { useEffect, useState } from 'react';

import { DataTable } from '../../components/DataTable';
import { ProgressBar } from '../../components/ProgressBar';
import { Header } from '../../components/Header';
import { DefaultPage } from '../DefaultPage';
import { CheckboxInput } from '../../components/CheckboxInput';

import styles from './styles.module.css';

import { projectName } from '../../settings';
import { InlineInput } from '../../components/InlineInput';
import Button from '../../components/Button';
import { BarButtons } from '../../components/BarButtons';
import UploadComponent from '../../components/UploadComponent';

export function Database() {

  const href = '/database';
  const progress = 0;
  const subProgress = 0;

  const tableColumns = 30;
  const tableLines = 4000;

  const [transpose, setTranspose] = useState(false);

  return(
    <>
      <Header 
        title={projectName}
      />
      <ProgressBar 
        progressNumber={progress}
        subProgressNumber={subProgress}
      />

      <div className={styles.container}>

        <InlineInput name={"Tipo de separador"} type={'text'} width={26}/>

        <UploadComponent/>

        <div className={styles.tableInfomation}>
          <CheckboxInput value={transpose} setValue={setTranspose}/>
          <p className={styles.tableDescription}>
            {`${tableLines} linhas x ${tableColumns} colunas`}
          </p>
        </div>

        <DataTable vertical={transpose}/>

        <Button 
          name={'Próximo'} 
          URL={'/pre-processing'} 
          stateToPass={{
            pageNumber: 0
          }}
          side={'right'}
        />
      </div>
    </>
  )
}