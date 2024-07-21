
import { useState } from 'react';
import styles from './styles.module.css';

import boxplotImage from '../../assets/boxplot.png';

const HelpContainer = () => {

  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive(!active);
  }

  return(
    <>
      <a onClick={() => handleClick()}>
        {active ? 'Close help' : 'Open help'}
      </a>
      {
        active &&
        <div className={styles.helpContainer}>
          <img src={boxplotImage} className={styles.imageHelp}/>
        </div>
      }
    </>
  )
}

export default HelpContainer;