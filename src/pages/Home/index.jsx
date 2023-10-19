
import { DefaultPage } from '../DefaultPage';
import { UserBar } from '../../components/UserBar';
import Input from '../../components/Input';
import { ProjectsTable } from './ProjectsTable';

import styles from './styles.module.css';

export function Home() {

  const name = "Daniel Alencar"

  return(
    <DefaultPage>
      <UserBar name={name}/>
      <div className={styles.inputContainer}>
        <Input name={"Todos os projetos"}/>
      </div>
      <ProjectsTable />
    </DefaultPage>
  )
}