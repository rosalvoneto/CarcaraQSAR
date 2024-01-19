import { useContext, useEffect, useState } from 'react';

import { DataTable } from '../../components/DataTable';
import { ProgressBar } from '../../components/ProgressBar';
import { Header } from '../../components/Header';
import { CheckboxInput } from '../../components/CheckboxInput';

import styles from './styles.module.css';

import { projectName } from '../../settings';
import { InlineInput } from '../../components/InlineInput';
import Button from '../../components/Button';
import UploadComponent from '../../components/UploadComponent';

import { getDatabase, getProjectName, sendDatabase } from '../../api/database';

import AuthContext from '../../context/AuthContext';

import { useParams } from 'react-router-dom';

import {
  convertFileToString, convertStringToCSVMatrix, convertStringToFile
} from '../../utils';

export function Database() {

  const href = '/database';
  const progress = 0;
  const subProgress = 0;

  const { projectID } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    getDatabase(projectID, authTokens.access)
    .then((response) => {
      const stringFile = response.content;
      const fileName = response.fileName;
      const file = convertStringToFile(stringFile, fileName);
      setSelectedFile(file);
    })
    .catch((error) => {
      console.log(error);
    })
    

    getProjectName(projectID, authTokens.access)
    .then((response) => {
      setProjectName(response.projectName);
    })
    .catch((error) => {
      console.log(error);
    })

  }, [])

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileMatrix, setFileMatrix] = useState([]);
  const [separator, setSeparator] = useState(',');
  const [transpose, setTranspose] = useState(false);

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

  const saveData = () => {
    // Enviar arquivo para o backend
    sendDatabase(projectID, selectedFile, authTokens.access);
  }

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
          URL={`/${projectID}/pre-processing`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'right'}
          action={saveData}
        />
      </div>
    </>
  )
}