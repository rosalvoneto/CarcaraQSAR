
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export function Option({ name, onChangeState }) {

  const [activated, setActivated] = useState(false);
  const [classNames, setClassNames] = useState(`${styles.text} ${
    false ? styles.textSelected : {}
  }`)

  const setState = () => {
    onChangeState(name, !activated);
    setActivated(!activated);
  }

  useEffect(() => {
    setClassNames(`${styles.text} ${
      activated ? styles.textSelected : {}
    }`);
  }, [activated])

  return(
    <p 
      className={classNames}
      onClick={setState}
    >
      { name }
    </p>
  )
}