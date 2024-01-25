
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';

import { ArrowClockwise } from "@phosphor-icons/react";

import styles from './styles.module.css';

const Loading = () => {
  return(
    <div className={styles.loadingContainer}>
      <ArrowClockwise 
        className={styles.loader} 
        size={30} color='#777777' 
        stroke='bold'
      />
    </div>
  )
}

export default Loading