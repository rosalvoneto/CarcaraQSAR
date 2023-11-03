
import Button from '../Button';
import styles from './styles.module.css';

export function BarButtons() {
  return(
    <div className={styles.container}>
      <Button 
        URL={''}
        stateToPass={{ pageNumber: 0 }}
        name={'Próximo'}
      />
    </div>
  )
}