import styles from './styles.module.css';

export default function Input({ name }) {
  return(
    <div>
      <p className={styles.description}>{name}</p>
      <input className={styles.input} type="text" />
    </div>
  )
}