import { UserBar } from '../../components/UserBar';
import { ProgressBar } from '../../components/ProgressBar';

import styles from './styles.module.css';

import { userName } from '../../settings';
import { RadionInput } from '../../components/RadioInput';

export const algorithms = [
  "Colônia de formigas",
  "Algoritmo genético",
  "Colônia de abelhas",
  "Cardume de peixes",
]

export default function VariablesSelection() {

  const href = '/variables-selection';
  const progress = 2;

  return(
    <>
      <UserBar name={userName}/>
      <ProgressBar progressNumber={progress}/>
      <div className={styles.container}>
        <RadionInput 
          name={"Aplicar algoritmo BioInspirado"}
          options={algorithms}
        />
        <RadionInput 
          name={"Remover automaticamente variáveis constantes"}
          options={["Sim", "Não"]}
        />
      </div>
    </>
  )
}