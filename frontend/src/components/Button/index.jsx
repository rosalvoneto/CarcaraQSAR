
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';

export default function Button({ name, URL, stateToPass, side, action }) {

  const navigate = useNavigate();
  console.log(URL);
  const actions = () => {
    if(action) {
      action();
    }
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
        onClick={() => actions()}
      >
        { name }
      </button>
    </div>
  )
}