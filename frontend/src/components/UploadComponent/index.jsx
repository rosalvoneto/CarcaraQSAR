import styles from './styles.module.css';

const UploadComponent = ({ 
  name, description, accept, selectedFile, setSelectedFile 
}) => {

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Atualiza o estado com o arquivo selecionado
      setSelectedFile(file);
    }

    // Reseta o valor do input para permitir o upload do mesmo arquivo novamente
    event.target.value = null;
  };

  return (
    <>
      <label htmlFor="fileUpload">
        {
          selectedFile 
          ? (
            `Database: ${selectedFile.name}`
          )
          : (
            "Choose your Database"
          )
        }
      </label>
      <input 
        id={name}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className={styles.fileInput} 
      />
      <button 
        onClick={() => document.getElementById(name).click()}
        className={styles.uploadContainer}
      >
        {description}
      </button>
    </>
  );
};

export default UploadComponent;
