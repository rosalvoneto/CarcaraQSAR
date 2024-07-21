
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './styles.module.css';

import { Option } from './Option';

import { getVariables } from '../../api/database';

import AuthContext from '../../context/AuthContext';

export function Selector({ 
  setRightListOfVariables, 
  rightListOfVariables, 
  setTemporaryListToAdd,
  temporaryListToAdd
}) {

  const { authTokens } = useContext(AuthContext);
  const { projectID } = useParams();

  const [variablesNames, setVariablesNames] = useState([]);
  const [inputText, setInputText] = useState('');

  const [leftListOfVariables, setLeftListOfVariables] = useState([]);

  const filterArray = (searchText, variablesToRemove) => {
    // Filtra as opções com base no texto digitado
    const filter1 = variablesNames.filter((option) =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );

    // Filtra com base na variáveis que já estão na lista para remover
    const filter2 = filter1.filter((item) =>
      !variablesToRemove.includes(item)
    );

    return filter2;
  }

  const handleInputChange = (e) => {
    const searchText = e.target.value;
    setInputText(searchText);
    
    const filtered = filterArray(searchText, rightListOfVariables);
    setLeftListOfVariables(filtered);
  };

  const setValuesToTheListToAdd = (variableName, variableValue) => {
    if(variableValue) {
      // Adicionar a lista
      if (!temporaryListToAdd.includes(variableName)) {
        setTemporaryListToAdd(
          [...temporaryListToAdd, variableName]
        )
      }
    } else {
      // Remover da lista
      let newlist = temporaryListToAdd.filter(
        item => item !== variableName
      );
      setTemporaryListToAdd(newlist);
    }
  }

  useEffect(() => {
    // Recuperar Database
    getVariables(projectID, authTokens.access)
    .then((response) => {
      if(response.variables) {
        // Salvar nomes das variáveis
        setVariablesNames(response.variables);
      }
    })
    .catch((error) => {
      console.log(error);
    })  
  }, [])

  useEffect(() => {
    const filtered = filterArray("", rightListOfVariables);
    setLeftListOfVariables(filtered);
  }, [variablesNames, rightListOfVariables])

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Type the choosen variable"
        className={styles.input}

        value={inputText}
        onChange={handleInputChange}
      />
      {
        <div 
          className={styles.optionsContainer}
          style={{ width: '100%' }}
        >
          {
            leftListOfVariables.map((option, index) => (
              <Option 
                key={index}
                name={option} 
                onChangeState={setValuesToTheListToAdd}
              />
            ))
          }
        </div>
      }
    </div>
  );
}
