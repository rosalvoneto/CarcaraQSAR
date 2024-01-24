import { useContext, useEffect, useState } from 'react';

import { DataTable } from '../../components/DataTable';
import { ProgressBar } from '../../components/ProgressBar';
import { Header } from '../../components/Header';
import { CheckboxInput } from '../../components/CheckboxInput';

import styles from './styles.module.css';

import { InlineInput } from '../../components/InlineInput';
import Button from '../../components/Button';
import UploadComponent from '../../components/UploadComponent';

import { getDatabase, getProjectName, sendDatabase } from '../../api/database';

import AuthContext from '../../context/AuthContext';

import { useParams } from 'react-router-dom';

export function Database() {

  const href = '/database';
  const progress = 0;
  const subProgress = 0;

  const { projectID } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [separator, setSeparator] = useState(',');
  const [transpose, setTranspose] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [showMatrixOfNewFile, setShowMatrixOfNewFile] = useState(false);

  const saveDatabase = () => {
    if(selectedFile) {
      // Enviar arquivo para o backend
      sendDatabase(projectID, selectedFile, separator, authTokens.access);
      return true;

    } else {
      alert('Você não escolheu nenhum arquivo TXT ou CSV');
      return false;
    }
  }

  useEffect(() => {
    // Resgatar nome do projeto
    getProjectName(projectID, authTokens.access)
    .then((response) => {
      setProjectName(response.projectName);
    })
    .catch((error) => {
      console.log(error);
    })

  }, [])

  useEffect(() => {
    if(selectedFile) {
      const isSaved = saveDatabase();
      setShowMatrixOfNewFile(isSaved);
    }
  }, [selectedFile]);

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
              `0 linhas x 0 colunas`
            }
          </p>
        </div>

        <DataTable 
          showMatrixOfNewFile={showMatrixOfNewFile}
          setShowMatrixOfNewFile={setShowMatrixOfNewFile}
          
          vertical={transpose}
        />

        <Button 
          name={'Próximo'} 
          URL={`/${projectID}/pre-processing`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'right'}
          action={saveDatabase}
        />
      </div>
    </>
  )
}