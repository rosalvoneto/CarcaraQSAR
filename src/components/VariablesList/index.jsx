import styles from './styles.module.css';

export function VariablesList() {

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
  ];

  return(
    <div className={styles.container}>
      <ul className={styles.list}>
        {
          variablesNames.map((variableName) => {
            return(
              <li className={styles.listItem}>{ variableName }</li>
            )
          })
        }
      </ul>
    </div>
  )
}