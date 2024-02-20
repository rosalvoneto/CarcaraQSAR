
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './styles.module.css';

import { Option } from './Option';

import { getVariables } from '../../api/database';

import AuthContext from '../../context/AuthContext';

export function Selector({ 
  setSelectedVariables, 
  selectedVariables, 
  setTemporaryListToAdd,
  temporaryListToAdd
}) {

  const { authTokens } = useContext(AuthContext);
  const { projectID } = useParams();

  const width = 700;

  const [inputText, setInputText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const [variablesNames, setVariablesNames] = useState([]);

  const handleInputChange = (e) => {
    const searchText = e.target.value;
    setInputText(searchText);

    // Filtra as opções com base no texto digitado
    const filtered = variablesNames.filter((option) =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if(selectedVariables.includes(filteredOptions[0]) == false) {
        setSelectedVariables([...selectedVariables, filteredOptions[0]]);
      }
    }
  }

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

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Digite a opção desejada"
          value={inputText}
          onChange={handleInputChange}
          className={styles.input}
          style={{ width: '100%' }}

          onKeyPress={handleKeyPress}
        />
      </div>
      
      {
        inputText.length
        ?
          <div 
            className={styles.optionsContainer}
            style={{ width: '100%' }}
          >
            {
              filteredOptions.map((option, index) => (
                <Option 
                  key={index}
                  name={option} 
                  active={index == 0 ? true : false}
                  onChangeState={setValuesToTheListToAdd}
                />
              ))
            }
          </div>
        :
          undefined
      }
      
    </div>
  );
}
