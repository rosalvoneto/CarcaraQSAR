
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';

export default function Button({ name, URL }) {

  const navigate = useNavigate();
  const handleTo = (URL) => {
    navigate(URL);
  }

  return(
    <button 
      className={styles.button}
      onClick={() => handleTo(URL)}
    >
      { name }
    </button>
  )
}