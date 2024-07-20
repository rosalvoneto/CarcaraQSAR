
import { useState, useEffect, useContext } from 'react';
import styles from './styles.module.css';

export function RadionInput(
  { name, options, setOption, firstOption, disabledInputs }
) {

  // Estado para controlar a opção selecionada
  const [selectedOption, setSelectedOption] = useState(firstOption);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setOption(event.target.value);

    console.log(event.target.value);
  };

  useEffect(() => {
    setSelectedOption(firstOption);
  }, [firstOption])

  return(
    <div className={styles.container}>

      <p className={styles.name}>
        <strong>{ name }</strong>
      </p>
      
      <div className={styles.contentContainer}>
        {
          options.map((option, index) => {
            return(
              <label key={index} className={styles.label}>
                <input
                  className={styles.input}
                  type="radio"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                  disabled={
                    disabledInputs
                    ?
                      disabledInputs.includes(index)
                    :
                      false
                  }
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
