
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';

export default function Button({ name, URL, stateToPass, side }) {

  const navigate = useNavigate();
  const handleTo = (URL) => {
    navigate(URL, { state: stateToPass });
  }


  let style = {};
  if(side == 'right') {
    style.right = 15;
  } else {
    style.left = 15;
  }

  return(
    <div 
      className={styles.container}
      style={style}
    >
      <button 
        className={styles.button}
        onClick={() => handleTo(URL)}
      >
        { name }
      </button>
    </div>
  )
}