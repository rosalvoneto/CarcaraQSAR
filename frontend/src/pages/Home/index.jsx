
import { DefaultPage } from '../DefaultPage';
import { Header } from '../../components/Header';
import { ProjectsTable } from './ProjectsTable';

import Input from '../../components/Input';

import { userName, recuperarDados } from '../../settings';

import styles from './styles.module.css';

import { useNavigate, redirect, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';

import AuthContext from '../../context/AuthContext';

export function Home() {

  const navigate = useNavigate();
  let { user } = useContext(AuthContext);

  user = "Daniel"

  if (!user) {
    console.log(user);
    
    return (
      <Navigate to={'/'}/>
    );
  } else {
    console.log(user);  
  }
  
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