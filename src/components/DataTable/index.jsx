import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export function DataTable({ vertical, onlyTitles }) {

  const variablesNames = [
    "Variável 1",
    "Variável 2",
    "Variável 3",
    "Variável 4",
    "Variável 5",
    "Variável 6",
    "Variável 7",
    "Variável 8",
    "Variável 9",
    "Variável 10",
    "Variável 11",
    "Variável 12",
    "Variável 13",
    "Variável 14",
    "Variável 15",
    "Variável 16",
  ];
  const registers = [
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
  ];

  let dataTable;
  if(onlyTitles) {
    dataTable = [variablesNames]
  } else {
    dataTable = [variablesNames, ...registers];
  }

  if(vertical) {
    dataTable = transporMatriz(dataTable);
  }

  function transporMatriz(matriz) {
    const linhas = matriz.length;
    const colunas = matriz[0].length;
  
    // Crie uma nova matriz transposta
    const matrizTransposta = [];
    for (let i = 0; i < colunas; i++) {
      matrizTransposta[i] = [];
      for (let j = 0; j < linhas; j++) {
        matrizTransposta[i][j] = matriz[j][i];
      }
    }
  
    return matrizTransposta;
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