import { UserBar } from '../../components/UserBar';
import { ProgressBar } from '../../components/ProgressBar';

import styles from './styles.module.css';

import { userName } from '../../settings';
import { Graph } from '../../components/Graph';

import GraphImage from '../../assets/results/importancia_das_variaveis.png';
import { useNavigate } from 'react-router-dom';

export default function Results() {

  const href = '/results';
  const progress = 4;

  const navigate = useNavigate();
  const handleTo = (URL) => {
    navigate(URL);
  }

  return(
    <>
      <UserBar name={userName}/>
      <ProgressBar progressNumber={progress}/>

      <div className={styles.container}>
        <Graph image={GraphImage} width={600}/>

        <button 
          className={styles.button}
          onClick={() => handleTo('/results')}
        >
          Próximo
        </button>
      </div>
    </>
  )
}