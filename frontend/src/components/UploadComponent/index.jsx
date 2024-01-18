import React, { useContext, useEffect, useState } from 'react';

import styles from './styles.module.css';

import AuthContext from '../../context/AuthContext';

import { sendDatabase } from '../../api/database';

const UploadComponent = ({ selectedFile, setSelectedFile }) => {

  const { authTokens } = useContext(AuthContext);

  const handleFileChange = (event) => {
    // Atualiza o estado com o arquivo selecionado
    setSelectedFile(event.target.files[0]);
    console.log("Arquivo selecionado!");
  };

  useEffect(() => {
    console.log("Mudança em selectedFile");
    console.log("Enviando arquivo para o backend!");
    sendDatabase(selectedFile, authTokens.access);

  }, [selectedFile]);

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        // Conteúdo do arquivo de texto
        const fileContent = e.target.result;
        console.log("Conteúdo:");
        console.log(fileContent);

        // Aqui você pode adicionar lógica adicional para enviar o conteúdo do arquivo para o servidor
        // por meio de uma chamada de API, por exemplo.
      };

      // Lê o conteúdo do arquivo como texto
      reader.readAsText(selectedFile);
    } else {
      alert('Por favor, selecione um arquivo de texto antes de fazer o upload.');
    }
  };

  return (
    <>
      <label htmlFor="fileUpload">
        {
          selectedFile 
          ? `Base de dados: ${selectedFile.name}`
          : "Escolha sua base de dados"
        }
      </label>
      <input 
        id='fileUpload'
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className={styles.fileInput} 
      />
      <button 
        onClick={() => document.getElementById('fileUpload').click()}
        className={styles.uploadContainer}
      >
        Escolher arquivo (CSV, TXT)
      </button>
    </>
  );
};

export default UploadComponent;
