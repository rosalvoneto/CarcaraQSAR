import { useEffect, useState } from 'react';

import styles from './styles.module.css';

import { transporMatriz } from '../../utils';

export function DataTable({ vertical, onlyTitles, Matrix }) {

  const [variablesNames, setvariablesNames] = useState([]);
  const [registers, setRegisters] = useState([]);

  const adjustMatrix = () => {
    const variablesNames = Matrix[0];
    setvariablesNames(variablesNames);
    
    const registers = Matrix.slice(1);
    setRegisters(registers);

    console.log(registers);
  }

  useEffect(() => {
    if(Matrix.length > 0)
      adjustMatrix();  
  }, [Matrix])


  let dataTable;
  if(onlyTitles) {
    dataTable = [variablesNames]
  } else {
    dataTable = [variablesNames, ...registers];
  }

  if(vertical) {
    dataTable = transporMatriz(dataTable);
  }
  
  return(
    <div 
      className={styles.container}
      style={vertical ? { width: 'fit-content' } : {}}
    >
      <div className={styles.contentContainer}>
        <table className={styles.table}>
          {
            /* 
            <thead className={styles.header}>
              <tr className={styles.headerRegister}>
                {
                  dataTable[0].map((variableName, index) => {
                    return(
                      <th 
                        className={styles.itemHeaderRegister}
                        key={index}
                      >
                        { variableName }
                      </th>
                    )
                  })
                }
              </tr>
            </thead> 
            */
          }
          <tbody className={styles.body}>
            {
              dataTable.map((register, index) => {
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