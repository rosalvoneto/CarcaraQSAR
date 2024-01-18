import React, { useState } from 'react';

import styles from './styles.module.css';

const UploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    // Atualiza o estado com o arquivo selecionado
    setSelectedFile(event.target.files[0]);
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
    <div className={styles.uploadContainer}>
      {/* <input 
        className={styles.uploadContainer} 
        type="file" 
        onChange={handleFileChange} 
      /> */}
      <p className={styles.uploadDescription}>
        Upload (CSV, TXT)
      </p>
    </div>
  );
};

export default UploadComponent;
