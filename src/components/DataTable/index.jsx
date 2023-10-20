import styles from './styles.module.css';

export function DataTable() {

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
  ];
  const registers = [
    [1,2,3,4,5,1,2,3,4,5,1,2,3,4,5],
    [1,2,3,4,5,1,2,3,4,5,1,2,3,4,5],
    [1,2,3,4,5,1,2,3,4,5,1,2,3,4,5],
    [1,2,3,4,5,1,2,3,4,5,1,2,3,4,5],
    [1,2,3,4,5,1,2,3,4,5,1,2,3,4,5],
  ]
  
  return(
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <table className={styles.table}>
          <thead className={styles.header}>
            <tr className={styles.headerRegister}>
              {
                variablesNames.map((variableName) => {
                  return(
                    <th className={styles.itemHeaderRegister}>{ variableName }</th>
                  )
                })
              }
            </tr>
          </thead>
          <tbody className={styles.body}>
            {
              registers.map((register) => {
                return(
                  <tr className={styles.bodyRegister}>
                  {
                    register.map((itemRegister) => {
                      return(
                        <td className={styles.itemBodyRegister}>{ itemRegister }</td>
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