import { useState } from 'react';
import styles from './styles.module.css';

export function CheckboxInput({ name, value, setValue }) {

  return(
    <div className={styles.container}>
      <p className={styles.description}>{name}</p>
      <input 
        type="checkbox" 
        className={styles.input}
        checked={value} 
        onChange={() => setValue(!value)} 
      />
    </div>
  )
}