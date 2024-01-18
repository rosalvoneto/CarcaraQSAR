import { useEffect, useState } from 'react';

import { DataTable } from '../../components/DataTable';
import { ProgressBar } from '../../components/ProgressBar';
import { Header } from '../../components/Header';
import { CheckboxInput } from '../../components/CheckboxInput';

import styles from './styles.module.css';

import { projectName } from '../../settings';
import { InlineInput } from '../../components/InlineInput';
import Button from '../../components/Button';
import UploadComponent from '../../components/UploadComponent';

export function Database() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileMatrix, setFileMatrix] = useState([]);
  const [separator, setSeparator] = useState(',');

  useEffect(() => console.log(separator), [separator])

  const href = '/database';
  const progress = 0;
  const subProgress = 0;

  const [transpose, setTranspose] = useState(false);

  const convertFileToString = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  };

  const convertStringToCSVMatrix = (CSVString, separator) => {
    const rows = CSVString.split('\n');
    let csvData = rows.map(row => row.split(separator));
    csvData.pop();

    while(csvData[csvData.length - 1][0] == '') {
      csvData.splice(csvData.length - 1, 1);
    }

    return csvData;
  };

  useEffect(() => {
    convertFileToString(selectedFile)
    .then((response) => {
      const matrix = convertStringToCSVMatrix(response, separator);
      setFileMatrix(matrix);
    })
    .catch((error) => {
      console.log(error);
    })
  }, [selectedFile])

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

        <InlineInput 
          name={"Tipo de separador"} type={'text'} width={26}
          separator={separator} setSeparator={setSeparator}
        />

        <UploadComponent
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        />

        <div className={styles.tableInfomation}>
          <CheckboxInput value={transpose} setValue={setTranspose}/>
          <p className={styles.tableDescription}>
            {
              `${fileMatrix.length} linhas x ${
                fileMatrix.length == 0 
                ? 0 
                : fileMatrix[0].length
              } colunas`
            }
          </p>
        </div>

        <DataTable vertical={transpose} Matrix={fileMatrix}/>

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