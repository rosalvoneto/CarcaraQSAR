import { useEffect, useState } from 'react';

import Loading from '../Loading';

import styles from './styles.module.css';

export function VariablesList({ variablesNames, onChangeVariable }) {

  const [loading, setLoading] = useState(true);
  const [selectedVariable, setSelectedVariable] = useState(0);

  const updateSelectedVariable = (index, variableName) => {
    setSelectedVariable(index);
    onChangeVariable(index, variableName);
  }

  useEffect(() => {
    if(variablesNames.length) {
      setLoading(false);
    }
  }, [variablesNames]);

  return(
    <div className={styles.container}>
      {
        loading
        ? <Loading />
        :
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
                    onClick={() => updateSelectedVariable(index, variableName)}
                  >
                    { variableName }
                  </li>
                )
              })
            }
          </ul>
      }
    </div>
  )
}