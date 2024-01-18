import React, { useState } from 'react';

import styles from './styles.module.css';

const UploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    // Atualiza o estado com o arquivo selecionado
    setSelectedFile(event.target.files[0]);
    console.log("Arquivo selecionado!");
  };

  const handleUpload = () => {
    // Aqui você pode implementar a lógica para fazer o upload do arquivo
    // por exemplo, usando uma API para enviar o arquivo para o servidor
    if (selectedFile) {
      console.log("Arquivo selecionado:", selectedFile);
      // Adicione a lógica de upload aqui
    } else {
      console.log("Nenhum arquivo selecionado.");
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

      {/* <button onClick={handleUpload}>Upload de Texto</button> */}
    </>
  );
};

export default UploadComponent;
