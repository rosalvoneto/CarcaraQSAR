import React, { useEffect, useState } from 'react';

import styles from './styles.module.css';

const ProgressBarLoading = ({ progress, maximum }) => {

  const [percentage, setPercentage] = useState(progress / maximum * 100);

  useEffect(() => {
    console.log("Valor da porcentagem:", progress / maximum * 100, "%");
    setPercentage(progress / maximum * 100);
  }, [progress, maximum]);

  return (
    <div>
      <div className={styles.container}>
        <div 
          style={{ width: `${percentage}%`}} 
          className={styles.bar}
        >
        </div>
      </div>
    </div>
  );
};

export default ProgressBarLoading;
