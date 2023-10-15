import styles from './styles.module.css';

import logo from '../../../assets/Logo.svg';

export default function Logo() {
  return(
    <div className={styles.container}>
      <img className={styles.image} src={logo} alt="logo" />
      <p className={styles.description}>
        Computational Algorithms to Relate Chemical Attributes With Respective Activities
      </p>
    </div>
  )
}