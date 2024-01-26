import { useEffect, useState } from 'react';
import styles from './styles.module.css';

import Loading from '../Loading';

export function Graph({ name, image, width }) {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!image) {
      setLoading(true);
    }
    if(typeof(image) === 'string') {
      setLoading(false);
    }
  }, [image])

  return(
    <div className={styles.graphContainer}>
      <p className={styles.name}>{name}</p>
      {
        loading
        ? <Loading />
        :
          <img src={image} className={styles.graph} 
            style={width ? { width: width } : {}}
          />
      }
    </div>
  )
}