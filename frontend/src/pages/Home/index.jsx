
import { DefaultPage } from '../DefaultPage';
import { Header } from '../../components/Header';
import Input from '../../components/Input';
import { ProjectsTable } from './ProjectsTable';

import { userName } from '../../settings';

import styles from './styles.module.css';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Home() {

  const navigate = useNavigate();

  const authenticated = false;

  useEffect(() => {
    if(!authenticated) {
      console.log('Redirecionando para a tela de login')
      navigate('/');
    }
  }, [])
  
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