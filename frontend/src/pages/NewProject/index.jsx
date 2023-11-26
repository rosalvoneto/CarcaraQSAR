import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DefaultPage } from '../DefaultPage';
import { Header } from '../../components/Header';

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

  const createProject = async (e, name, description) => {

    e.preventDefault();

    let response = await fetch('http://localhost:8000/project/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
      })
    })

    console.log(response);

    let data = await response.json();
    if(response.status == 200) {

      console.log(data);

    } else {
      alert('Preencha as informações corretamente!');
    }
  }

  return(
    <>
      <Header 
        userName={userName}
      />
      
      <form 
        className={styles.container}
        onSubmit={(e) => createProject(e, name, description)} 
        method='POST'
      >
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

          <input 
            type='submit'
            className={styles.button}
            value={'Criar Projeto'}
          />
        </div>
      </form>

    </>
  )
}