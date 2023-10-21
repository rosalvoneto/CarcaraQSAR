import { useEffect, useState } from 'react';

import { DataTable } from '../../components/DataTable';
import { ProgressBar } from '../../components/ProgressBar';
import { UserBar } from '../../components/UserBar';
import { DefaultPage } from '../DefaultPage';
import { CheckboxInput } from '../../components/CheckboxInput';

import styles from './styles.module.css';

import { useNavigate } from 'react-router-dom'; 
import { userName } from '../../settings';

export function Database() {

  const href = '/database';
  const progress = 0;

  const [transpose, setTranspose] = useState(false);

  const navigate = useNavigate();
  const handleTo = (URL) => {
    navigate(URL);
  }

  return(
    <>
      <UserBar name={userName}/>
      <ProgressBar progressNumber={progress}/>

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

      <button 
        className={styles.button}
        onClick={() => handleTo('/pre-processing')}
      >
        Próximo
      </button>
    </>
  )
}