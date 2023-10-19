import { useState } from 'react';
import styles from './styles.module.css';

export default function Input({ name, setValue }) {

  const [text, setText] = useState("");

  const changeText = (e) => {
    setText(e.target.value);
    setValue(text);
  };

  return(
    <div className={styles.container}>
      <p className={styles.description}>{name}</p>
      <input 
        className={`${styles.inputType}`} 
        type="text"
        value={text}
        onChange={changeText}
      />
    </div>
  )
}