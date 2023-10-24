
import { useState } from 'react';
import styles from './styles.module.css';

export function RadionInput({ name, options, setOption }) {

  // Estado para controlar a opção selecionada
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setOption(event.target.value);
  };

  return(
    <div className={styles.container}>

      <p className="name">
        <strong>{ name }</strong>
      </p>
      
      <div className={styles.contentContainer}>
        {
          options.map((option, index) => {
            return(
              <label className={styles.label}>
                <input
                  className={styles.input}
                  type="radio"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                />
                {option}
              </label>
            )
          })
        }
      </div>

    </div>
  )
}
