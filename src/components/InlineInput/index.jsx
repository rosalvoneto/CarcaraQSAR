
import styles from './styles.module.css';

export function InlineInput({ name }) {
  return(
    <div className={styles.inlineInputContainer}>
      <p className={styles.descritptor}>{ name }</p>
      <input type="text" className={styles.input} />
    </div>
  )
}