import { useState } from 'react';

import styles from './styles.module.css';

export function VariablesList({ variablesNames, onChange }) {

  const [selectedVariable, setSelectedVariable] = useState(0);

  const updateSelectedVariable = (index) => {
    setSelectedVariable(index);
    onChange(index);
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