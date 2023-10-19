import { useEffect, useState } from 'react';
import { DefaultPage } from '../DefaultPage';
import { UserBar } from '../Home/UserBar';

import Input from '../../components/Input';
import TextArea from '../../components/TextArea';

import styles from './styles.module.css';

export function NewProject() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return(
    <DefaultPage>
      <UserBar name={"Daniel Alencar"}/>
      
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
        </div>
      </div>

    </DefaultPage>
  )
}