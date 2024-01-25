
import styles from './styles.module.css';

export function InlineInput({ name, type, width, value, setValue }) {
  return(
    <div className={styles.inlineInputContainer}>
      <p className={styles.descritptor}>{ name }</p>
      <input 
        type={type}
        className={styles.input} 
        style={ width ? { width: width } : {}}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}