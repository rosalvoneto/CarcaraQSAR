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

  const createProject = async (e) => {

    e.preventDefault();

    const name = e.target.name.value;
    const description = e.target.description.value;

    if(name == "" || description == "") {
      return alert("Preencha os campos corretamente!")
    }

    let response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/new/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          project_name: name,
          project_description: description,
          project_user_email: "danielalencar746@gmail.com"
        })
    })

    let data = await response.json();
    if(response.status == 200) {
      console.log(data);

      navigate('/home');
    } else {
      alert('Erro interno do servidor!');
    }
  }

  return(
    <>
      <Header 
        userName={userName}
      />
      
      <form 
        className={styles.container}
        onSubmit={(e) => createProject(e)} 
        method='POST'
      >
        <div className={styles.contentContainer}>
          <Input 
            tipo={"input"} name={"Nome do Projeto"}
            inputName={"name"}
            type={"text"}
            setValue={setName}
            value={name}
          />
          <TextArea 
            tipo={"textarea"} name={"Descrição"}
            inputName={"description"}
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