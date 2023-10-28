
import React, { useState } from 'react';

import styles from './styles.module.css';

import { Option } from './Option';

import { variablesNames } from '../../settings';
import { CaretUp, CaretDown } from '@phosphor-icons/react';

export function Selector({ setSelectedVariables, selectedVariables }) {

  const width = 700;

  const [inputText, setInputText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

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

  return (
    <div className={styles.container}>
      <p className={styles.name}>
        <strong>{"Remover variáveis manualmente"}</strong>
      </p>

      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Digite a opção desejada"
          value={inputText}
          onChange={handleInputChange}
          className={styles.input}
          style={{ width: width }}

          onKeyPress={handleKeyPress}
        />
        <a className={styles.button}>
          <CaretUp size={23}/>
        </a>
        <a className={styles.button}>
          <CaretDown size={23}/>
        </a>
      </div>
      
      {
        inputText.length
        ?
          <div 
            className={styles.optionsContainer}
            style={{ width: width }}
          >
            {
              filteredOptions.map((option, index) => (
                <Option text={option} active={index == 0 ? true : false}/>
              ))
            }
          </div>
        :
          undefined
      }
      
    </div>
  );
}
