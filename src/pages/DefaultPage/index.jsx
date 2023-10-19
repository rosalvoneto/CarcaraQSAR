import NavigationBar from '../../components/NavigationBar';

import styles from './styles.module.css';

export function DefaultPage({ children }) {
  return(
    <div className={styles.container}>
      <NavigationBar />
      <div className={styles.pageContentContainer}>
        { children }
      </div>
    </div>
  )
}