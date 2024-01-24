import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AuthContext from '../../context/AuthContext';

import styles from './styles.module.css';

import { getDatabase } from '../../api/database';

import { convertJsonObjectInMatrix } from '../../utils';

export function DataTable({ vertical, setShowMatrixOfNewFile, showMatrixOfNewFile }) {

  const { projectID } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [matrix, setMatrix] = useState([]);

  useEffect(() => {
    // Resgatar database
    getDatabase(projectID, authTokens.access, vertical)
    .then((response) => {
      if(response.database) {
        const jsonData = response.database;
        const matrix = convertJsonObjectInMatrix(jsonData);

        setMatrix(matrix);
      }
    })
    .catch((error) => {
      console.log(error);
    })

    // Sinal de que não precisa resgatar novamente o database
    setShowMatrixOfNewFile(false);

  }, [vertical, showMatrixOfNewFile]);
  
  return(
    <div 
      className={styles.container}
      style={vertical ? { width: 'fit-content' } : {}}
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