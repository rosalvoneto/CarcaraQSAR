
import { Option } from './Option';
import styles from './styles.module.css';

import React, { useState } from 'react';

export function Selector() {
  const options = ['Maçã', 'Banana', 'Cereja', 'Uva', 'Pêssego'];

  const [inputText, setInputText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleInputChange = (e) => {
    const searchText = e.target.value;
    setInputText(searchText);

    // Filtra as opções com base no texto digitado
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  return (
    <div className={styles.container}>
      <p className={styles.name}>
        <strong>{"Remover variáveis manualmente"}</strong>
      </p>
      <input
        type="text"
        placeholder="Digite a opção desejada"
        value={inputText}
        onChange={handleInputChange}
        className={styles.input}
      />
      <div className={styles.optionsContainer}>
        {
          filteredOptions.map((option, index) => (
            <Option text={option} active={index == 0 ? true : false}/>
          ))
        }
      </div>
    </div>
  );
}
