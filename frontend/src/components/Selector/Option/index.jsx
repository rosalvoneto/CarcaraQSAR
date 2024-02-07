
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export function Option({ name, active, onChangeState }) {

  const [activated, setActivated] = useState(active);
  const [classNames, setClassNames] = useState(`${styles.text} ${
    active ? styles.textSelected : {}
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