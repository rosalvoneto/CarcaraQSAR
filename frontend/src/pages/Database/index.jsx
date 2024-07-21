import { useContext, useEffect, useState } from 'react';

import { DataTable } from '../../components/DataTable';
import { ProgressBar } from '../../components/ProgressBar';
import { Header } from '../../components/Header';
import { CheckboxInput } from '../../components/CheckboxInput';

import styles from './styles.module.css';

import { InlineInput } from '../../components/InlineInput';
import Button from '../../components/Button';
import UploadComponent from '../../components/UploadComponent';

import { 
  convertAndSendDatabase, getDatabase, sendDatabase 
} from '../../api/database';

import { updateStatus } from '../../api/project';

import AuthContext from '../../context/AuthContext';
import ProjectContext from '../../context/ProjectContext';

import { useParams } from 'react-router-dom';

export default function Database() {

  const href = '/database';
  const progress = 0;
  const subProgress = 0;

  const { projectID } = useParams();
  const { authTokens } = useContext(AuthContext);
  const { projectDetails } = useContext(ProjectContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSmilesFile, setSelectedSmilesFile] = useState(null);

  const [isSMILESConversion, setIsSMILESConversion] = useState(false);
  
  const [transpose, setTranspose] = useState(false);
  const [separator, setSeparator] = useState(',');

  const [database, setDatabase] = useState({
    database: undefined,
    name: null,
    lines: 0,
    columns: 0,
  });

  // Enviar Database para o backend
  const saveDatabase = async () => {
    if(selectedFile) {
      const isSaved = await sendDatabase(
        projectID, selectedFile, separator, authTokens.access
      );
      return isSaved;
    } else {
      return false;
    }
  }

  // Fazer download automático do CSV que vem do Backend
  const handleDownload = async (response) => {
    try {
      // Crie um link temporário e clique nele para iniciar o download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;

      // Exemplo de uma string contendo o nome do arquivo com várias extensões
      let fileName = selectedSmilesFile.name;

      // Encontrar a última ocorrência do ponto na string
      let lastIndex = fileName.lastIndexOf('.');

      // Extrair a parte da string até o último ponto
      let newFileName = fileName.substring(0, lastIndex);

      link.setAttribute('download', `${newFileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  const nextActionButton = async () => {
    if(database.database) {
      return true;
    } else {
      alert('Você não escolheu nenhum arquivo');
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

      setIsSMILESConversion(false);

      setDatabase({
        database: null,
        name: null,
        lines: 0,
        columns: 0
      });

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

  useEffect(() => {
    if(selectedSmilesFile !== null) {

      setIsSMILESConversion(true);

      setDatabase({
        database: null,
        name: null,
        lines: 0,
        columns: 0
      });

      convertAndSendDatabase(projectID, selectedSmilesFile, authTokens.access)
      .then((response) => {
        // Fazer o download do arquivo CSV
        return handleDownload(response);
      })
      .then((response) => {
        // Resgatar informações do novo Database
        return getDatabase(projectID, authTokens.access, transpose)
      })
      .then((response) => {
        if(response.database) {
          // Salvar Database
          setDatabase(response);
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }, [selectedSmilesFile])

  useEffect(() => {
    updateStatus(projectID, authTokens.access, 'Database');
  }, [])

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
          name={"Separator"} type={'text'} width={26}
          value={separator} setValue={setSeparator}
        />

        <UploadComponent
          name={'uploadTXTorCSV'}
          description={'Choose file (CSV, TXT)'}
          accept={".txt, .csv"}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
          />
        <UploadComponent
          name={'uploadSmiles'}
          description={'Choose SMILES file'}
          accept={".txt, .csv, .smi"}
          setSelectedFile={setSelectedSmilesFile}
          selectedFile={selectedSmilesFile}
        />

        <div className={styles.tableInfomation}>
          <CheckboxInput 
            name={"Transpose:"}
            value={transpose} 
            setValue={(value) => {
              setTranspose(value);
              setIsSMILESConversion(false);
            }}
          />
          <p className={styles.tableDescription}>
            {
              `${database.lines} rows x ${database.columns} columns`
            }
          </p>
        </div>
        
        <DataTable
          transpose={transpose}
          jsonDatabase={database.database}
          isSMILESConversion={isSMILESConversion}
        />
        
        <Button 
          name={'Next'} 
          URL={`/pre-processing`}
          stateToPass={{
            pageNumber: 0
          }}
          side={'right'}
          action={nextActionButton}
        />
      </div>
    </>
  )
}