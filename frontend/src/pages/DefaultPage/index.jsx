import { NavigationBarWidth } from '../../settings';
import styles from './styles.module.css';

import NavigationBar from '../../components/NavigationBar';

export function DefaultPage({ children }) {
  return(
    <div className={styles.container}>
      <NavigationBar />
      <div 
        className={styles.pageContentContainer}
        style={{ width: `calc(100% - ${NavigationBarWidth}px)` }}
      >
        { children }
      </div>
    </div>
  )
}