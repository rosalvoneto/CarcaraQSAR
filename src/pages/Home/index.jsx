import NavigationBar from '../../components/NavigationBar';
import Input from '../../components/Input';
import { UserBar } from './UserBar';

import { ProjectsTable } from './ProjectsTable';
import { Table } from './Table'; 

import styles from './styles.module.css';

export function Home() {

  const name = "Daniel Alencar"

  return(
    <div className={styles.container}>
      <NavigationBar />
      <div className={styles.pageContentContainer}>
        <UserBar name={name}/>
        <div className={styles.inputContainer}>
          <Input name={"Todos os projetos"}/>
        </div>
        <ProjectsTable />
      </div>
    </div>
  )
}