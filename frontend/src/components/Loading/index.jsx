import { useEffect, useState } from 'react';

import { ArrowClockwise } from "@phosphor-icons/react";

import styles from './styles.module.css';

const Loading = ({ size }) => {

  const [showTimer, setShowTimer] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // useEffect(() => {
  //   if (seconds >= 3) {
  //     setShowTimer(true);
  //   }
  // }, [seconds]);

  return(
    <div className={styles.loadingContainer}>
      <ArrowClockwise 
        className={styles.loader} 
        size={size ? size : 30} color='#777777' 
        stroke='bold'
      />
      {
        showTimer && <p style={{ color: '#777777' }}>{seconds} segundos...</p>
      }
    </div>
  )
}

export default Loading