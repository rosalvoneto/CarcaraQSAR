import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './styles.module.css';

import AuthContext from '../../context/AuthContext';
import Loading from '../Loading';

import { getConversionProgress, getDatabase } from '../../api/database';
import { convertJsonObjectInMatrix } from '../../utils';

import ProgressBarLoading from '../ProgressBarLoading';

export function DataTable({ 
  transpose, 
  jsonDatabase,
  isSMILESConversion
}) {

  const { projectID } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [matrix, setMatrix] = useState([]);

  const [conversionProgress, setConversionProgress] = useState("0/100");

  const setLoadingValue = (value) => {
    setLoading(value);
  }

  const getProgress = async() => {
    if(loading) {
      const response = await getConversionProgress(projectID, authTokens.access);
      if(response.progress) {
        setConversionProgress(response.progress);
      }
    }
  }

  useEffect(() => {
    setLoadingValue(true);

    // Resgatar Database de acordo com a mudança na transposição da matriz
    getDatabase(projectID, authTokens.access, transpose)
    .then((response) => {
      if(response.database) {
        const jsonData = response.database;
        const matrix = convertJsonObjectInMatrix(jsonData);
        setMatrix(matrix);
      }
      setLoadingValue(false);
    })
    .catch((error) => {
      console.log(error);
    })

  }, [transpose]);

  useEffect(() => {

    if(jsonDatabase === null) {
      setLoadingValue(true);
    }

    // Transformar em matriz toda vez que tiver um novo Database no backend
    if(jsonDatabase) {
      const matrix = convertJsonObjectInMatrix(jsonDatabase);
      setMatrix(matrix);
      setLoadingValue(false);
    }

  }, [jsonDatabase])

  useEffect(() => {
    // A função será executada a cada quantidade de segundos
    const interval = setInterval(getProgress, 1000);
    // Função de limpeza para interromper o intervalo quando 
    // o componente for desmontado
    return () => clearInterval(interval);
  }, [loading]);

  if(loading) {
    if(isSMILESConversion) {
      return (
        <div className={styles.loadingContainer}>
          <Loading/>
          <ProgressBarLoading 
            progress={Number(conversionProgress.split('/')[0])}
            maximum={Number(conversionProgress.split('/')[1])}
          />
          <p> {conversionProgress} rows on file</p>
        </div>
      )
    } else {
      return (
        <div className={styles.loadingContainer}>
          <Loading/>
        </div>
      )
    }
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