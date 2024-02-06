import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';

import { ArrowClockwise } from "@phosphor-icons/react";

import styles from './styles.module.css';

const Loading = () => {

  const [showTimer, setShowTimer] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds >= 3) {
      setShowTimer(true);
    }
  }, [seconds]);

  return(
    <div className={styles.loadingContainer}>
      <ArrowClockwise 
        className={styles.loader} 
        size={30} color='#777777' 
        stroke='bold'
      />
      {
        showTimer && <p>{seconds} segundos...</p>
      }
    </div>
  )
}

export default Loading