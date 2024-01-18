
import styles from './styles.module.css';

export function InlineInput({ name, type, width, separator, setSeparator }) {
  return(
    <div className={styles.inlineInputContainer}>
      <p className={styles.descritptor}>{ name }</p>
      <input 
        type={type}
        className={styles.input} 
        style={ width ? { width: width } : {}}
        value={separator}
        onChange={(e) => setSeparator(e.target.value)}
      />
    </div>
  )
}