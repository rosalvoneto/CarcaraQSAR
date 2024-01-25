import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './styles.module.css';

import AuthContext from '../../context/AuthContext';
import Loading from '../Loading';

import { getDatabase } from '../../api/database';
import { convertJsonObjectInMatrix } from '../../utils';

export function DataTable({ 
  transpose, 
  jsonDatabase
}) {

  const { projectID } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [matrix, setMatrix] = useState([]);

  useEffect(() => {
    setLoading(true);

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

  if(loading) {
    return <Loading/>
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