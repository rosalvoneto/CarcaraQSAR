import { useState } from 'react';
import styles from './styles.module.css';

export default function Input({ name, setValue, type }) {

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
        value={text}
        onChange={changeText}

        type={type ? type : 'text'}
        name={name}
      />
    </div>
  )
}