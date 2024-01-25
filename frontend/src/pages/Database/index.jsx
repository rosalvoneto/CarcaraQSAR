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
import ProjectContext from '../../context/ProjectContext';

import { useParams } from 'react-router-dom';

export function Database() {

  const href = '/database';
  const progress = 0;
  const subProgress = 0;

  const { projectID } = useParams();
  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [transpose, setTranspose] = useState(false);
  const [separator, setSeparator] = useState(',');
  const [database, setDatabase] = useState({
    database: null,
    name: null,
    lines: 0,
    columns: 0
  });

  const saveDatabase = async () => {
    if(selectedFile) {
      // Enviar Database para o backend
      const isSaved = await sendDatabase(projectID, selectedFile, separator, authTokens.access);
      return isSaved;

    } else {
      alert('Você não escolheu nenhum arquivo TXT ou CSV');
      return false;
    }
  }

  useEffect(() => {
    // Resgatar informações do database após a página carregar
    getDatabase(projectID, authTokens.access, transpose)
    .then((response) => {
      if(response.database) {
        // Salvar Database
        setDatabase(response);
      }
    })
    .catch((error) => {
      console.log(error);
    })

  }, [])
  

  useEffect(() => {
    if(selectedFile) {
      saveDatabase()
      .then((isSaved) => {
        if(isSaved) {
          // Resgatar informações do novo Database
          getDatabase(projectID, authTokens.access, transpose)
          .then((response) => {
            if(response.database) {
              // Salvar Database
              setDatabase(response);
            }
          })
          .catch((error) => {
            console.log(error);
          })
        }
      })

    }
  }, [selectedFile]);

  return(
    <>
      <Header 
        title={projectDetails.name}
      />
      <ProgressBar 
        progressNumber={progress}
        subProgressNumber={subProgress}
      />

      <div className={styles.container}>

        <InlineInput 
          name={"Tipo de separador"} type={'text'} width={26}
          value={separator} setValue={setSeparator}
        />

        <UploadComponent
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        />

        <div className={styles.tableInfomation}>
          <CheckboxInput value={transpose} setValue={setTranspose}/>
          <p className={styles.tableDescription}>
            {
              `${database.lines} linhas x ${database.columns} colunas`
            }
          </p>
        </div>
        
        <DataTable
          transpose={transpose}
          jsonDatabase={database.database}
        />
        
        <Button 
          name={'Próximo'} 
          URL={`/${projectID}/pre-processing`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'right'}
          action={() => true}
        />
      </div>
    </>
  )
}