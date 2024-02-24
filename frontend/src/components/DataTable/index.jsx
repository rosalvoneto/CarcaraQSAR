import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './styles.module.css';

import AuthContext from '../../context/AuthContext';
import Loading from '../Loading';

import { getConversionProgress, getDatabase } from '../../api/database';
import { convertJsonObjectInMatrix } from '../../utils';

export function DataTable({ 
  transpose, 
  jsonDatabase
}) {

  const { projectID } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [matrix, setMatrix] = useState([]);

  const [conversionProgress, setConversionProgress] = useState("");

  const getProgress = async() => {
    if(loading) {
      const response = await getConversionProgress(projectID, authTokens.access);
      setConversionProgress(response.progress);
      console.log(response.progress);
    }
  }

  useEffect(() => {

    if(jsonDatabase === null) {
      setLoading(true);
    }

    // Transformar em matriz toda vez que tiver um novo Database no backend
    if(jsonDatabase) {
      const matrix = convertJsonObjectInMatrix(jsonDatabase);
      setMatrix(matrix);
      setLoading(false);
    }

  }, [jsonDatabase])

  useEffect(() => {
    setLoading(true);

    // Resgatar Database de acordo com a mudança na transposição da matriz
    getDatabase(projectID, authTokens.access, transpose)
    .then((response) => {
      if(response.database) {
        const jsonData = response.database;
        const matrix = convertJsonObjectInMatrix(jsonData);
        setMatrix(matrix);
        setLoading(false);
      }
    })
    .catch((error) => {
      console.log(error);
    })

  }, [transpose]);

  useEffect(() => {
    // A função será executada a cada 5 segundos (5000 milissegundos)
    const interval = setInterval(getProgress, 1000);
    // Função de limpeza para interromper o intervalo quando 
    // o componente for desmontado
    return () => clearInterval(interval);
  }, [loading]);

  if(loading) {
    return (
    <div className={styles.loadingContainer}>
      <Loading/>
      <p>Convertendo {conversionProgress} linhas do arquivo SMILES</p>
    </div>
  )
  } else {
    return (
      <div 
        className={styles.container}
        style={transpose ? { width: 'fit-content' } : {}}
      >
        <div className={styles.contentContainer}>
          <table className={styles.table}>
            <tbody className={styles.body}>
              {
                matrix.map((register, index) => {
                  
                  if(index == 0 && transpose) {
                    return undefined;
                  }

                  return(
                    <tr 
                      className={styles.bodyRegister}
                      key={index}
                    >
                    {
                      register.map((itemRegister, indexItem) => {
                        return(
                          <td 
                            className={styles.itemBodyRegister}
                            key={indexItem}
                          >
                            { itemRegister }
                          </td>
                        )
                      })
                    }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}