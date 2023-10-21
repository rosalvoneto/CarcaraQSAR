
import { DefaultPage } from '../DefaultPage';
import { UserBar } from '../../components/UserBar';
import Input from '../../components/Input';
import { ProjectsTable } from './ProjectsTable';

import { userName } from '../../settings';

import styles from './styles.module.css';

export function Home() {

  return(
    <>
      <UserBar name={userName}/>
      <div className={styles.inputContainer}>
        <Input name={"Todos os projetos"}/>
      </div>
      <ProjectsTable />
    </>
  )
}