import styles from './styles.module.css';

export function Graph({ name, image, width }) {
  return(
    <div className={styles.graphContainer}>
      <p className={styles.name}>{name}</p>
      <img src={image} alt="graph" className={styles.graph} 
        style={width ? { width: width } : {}}
      />
    </div>
  )
}