
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export function InlineInput({ name, type, width, value, setValue }) {

  const [state, setState] = useState(value);

  return(
    <div className={styles.inlineInputContainer}>
      <p className={styles.descriptor}>{ name }</p>
      <input 
        type={type}
        className={styles.input} 
        style={ width ? { width: width } : {}}
        value={state}
        onChange={(e) => {
          if(type == "number") {
            setState(Number(e.target.value));
            setValue(Number(e.target.value));
          } else {
            setState(e.target.value);
            setValue(e.target.value);
          }
        }}
      />
    </div>
  )
}