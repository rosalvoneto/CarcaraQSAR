import { UserBar } from '../../components/UserBar';
import { ProgressBar } from '../../components/ProgressBar';

import styles from './styles.module.css';

import { userName } from '../../settings';
import Button from '../../components/Button';

export default function Outliers() {

  const href = '/outliers';
  const progress = 5;

  return(
    <>
      <UserBar name={userName}/>
      <ProgressBar progressNumber={progress}/>

      <Button name={'Finalizar'} URL={'/home'} />
    </>
  )
}