import NavigationBar from '../../components/NavigationBar';
import Input from '../../components/Input';
import { ProjectsTable } from './ProjectsTable';

import styles from './styles.module.css';
import { UserBar } from './UserBar';

export function Home() {

  const name = "Daniel Alencar"

  return(
    <div className={styles.container}>
      <NavigationBar />
      <div className={styles.pageContentContainer}>
        <UserBar name={name}/>
        <Input name={"Todos os projetos"}/>
        <ProjectsTable />
      </div>
    </div>
  )
}