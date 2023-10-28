
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';

export default function Button({ name, URL, stateToPass }) {

  const navigate = useNavigate();
  const handleTo = (URL) => {
    navigate(URL, { state: stateToPass });
  }

  return(
    <div className={styles.container}>
      <button 
        className={styles.button}
        onClick={() => handleTo(URL)}
      >
        { name }
      </button>
    </div>
  )
}