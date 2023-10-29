import { useState } from 'react';
import styles from './styles.module.css';

export default function TextArea({ name, setValue }) {

  const [text, setText] = useState("");

  const changeText = (e) => {
    setText(e.target.value);
    setValue(text);
  };

  return(
    <div className={styles.container}>
      <p className={styles.description}>{name}</p>
      <textarea 
        className={`${styles.textareaType}`}
        rows={5}
        value={text}
        onChange={changeText}
      >
      </textarea>
    </div>
  )
}