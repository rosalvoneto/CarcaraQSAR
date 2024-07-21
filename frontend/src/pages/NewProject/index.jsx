import { useContext, useState } from 'react';

import { Header } from '../../components/Header';

import Input from '../../components/Input';
import TextArea from '../../components/TextArea';

import styles from './styles.module.css';

import { createProject } from '../../api/project';
import AuthContext from '../../context/AuthContext';

export default function NewProject() {

  const { authTokens } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return(
    <>
      <Header />
      
      <form 
        className={styles.container}
        onSubmit={(e) => createProject(e, authTokens.access)} 
      >
        <div className={styles.contentContainer}>
          <Input 
            tipo={"input"} name={"Project name"}
            inputName={"name"}
            type={"text"}
            setValue={setName}
            value={name}
          />
          <TextArea 
            tipo={"textarea"} name={"Description"}
            inputName={"description"}
            setValue={setDescription}
            value={description}
          />

          <input 
            type='submit'
            className={styles.button}
            value={'Create project'}
          />
        </div>
      </form>

    </>
  )
}