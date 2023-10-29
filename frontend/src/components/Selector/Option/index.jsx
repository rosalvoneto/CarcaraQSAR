
import styles from './styles.module.css';

export function Option({ text, active }) {

  const classNames = `${styles.text} ${
    active ? styles.textSelected : {}
  }`

  return(
    <p className={classNames}>
      { text }
    </p>
  )
}