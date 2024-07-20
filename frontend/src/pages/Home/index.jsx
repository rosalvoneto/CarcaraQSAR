
import { Header } from '../../components/Header';
import { ProjectsTable } from './ProjectsTable';

import Input from '../../components/Input';

import styles from './styles.module.css';

import { useState } from 'react';

export default function Home() {

  const [searchValue, setSearchValue] = useState("");

  // Função para atualizar o estado
  const setNewSearchValue = (newSearchValue) => {
    setSearchValue(newSearchValue);
  };
  
  return(
    <>
      <>
        <Header />
        <div className={styles.inputContainer}>
          <Input name={"Todos os projetos"} setValue={setNewSearchValue}/>
        </div>
        <ProjectsTable searchValue={searchValue}/>
      </>
    </>
  )
}