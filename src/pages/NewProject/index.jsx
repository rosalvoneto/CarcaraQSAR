import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DefaultPage } from '../DefaultPage';
import { UserBar } from '../../components/UserBar';

import Input from '../../components/Input';
import TextArea from '../../components/TextArea';

import { userName } from '../../settings';

import styles from './styles.module.css';

export function NewProject() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const handleTo = (url) => {
    navigate(url);
  };

  return(
    <DefaultPage>
      <UserBar name={userName}/>
      
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <Input 
            tipo={"input"} name={"Nome do Projeto"}
            setValue={setName}
            value={name}
          />
          <TextArea 
            tipo={"textarea"} name={"Descrição"}
            setValue={setDescription}
            value={description}
          />
          <button 
            className={styles.button}
            onClick={() => handleTo('/project')}
          >
            Criar projeto
          </button>
        </div>
      </div>

    </DefaultPage>
  )
}