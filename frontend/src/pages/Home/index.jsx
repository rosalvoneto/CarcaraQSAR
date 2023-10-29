
import { DefaultPage } from '../DefaultPage';
import { Header } from '../../components/Header';
import Input from '../../components/Input';
import { ProjectsTable } from './ProjectsTable';

import { userName } from '../../settings';

import styles from './styles.module.css';

export function Home() {

  return(
    <>
      <Header 
        userName={userName}
      />
      <div className={styles.inputContainer}>
        <Input name={"Todos os projetos"}/>
      </div>
      <ProjectsTable />
    </>
  )
}