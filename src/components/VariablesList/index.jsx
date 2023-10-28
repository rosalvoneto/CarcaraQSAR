import { useState } from 'react';

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
    "Variável 11",
    "Variável 12",
    "Variável 13",
    "Variável 14",
    "Variável 15",
    "Variável 16",
    "Variável 17",
    "Variável 18",
    "Variável 19",
    "Variável 20",
  ];

  const [selectedVariable, setSelectedVariable] = useState(0);

  const updateSelectedVariable = (index) => {
    console.log(index);
    setSelectedVariable(index);
  }

  return(
    <div className={styles.container}>
      <ul className={styles.list}>
        {
          variablesNames.map((variableName, index) => {

            const classNames = `${styles.listItem} ${
              index == selectedVariable
              ? styles.litsItemSelected
              : {}
            }`;

            return(
              <li 
                key={index}
                className={classNames}
                onClick={() => updateSelectedVariable(index)}
              >
                { variableName }
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}