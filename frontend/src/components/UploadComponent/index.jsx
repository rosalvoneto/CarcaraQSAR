import styles from './styles.module.css';

const UploadComponent = ({ 
  name, description, accept, selectedFile, setSelectedFile 
}) => {

  const handleFileChange = (event) => {
    // Atualiza o estado com o arquivo selecionado
    setSelectedFile(event.target.files[0]);
    console.log("Arquivo selecionado!");
  };

  return (
    <>
      <label htmlFor="fileUpload">
        {
          selectedFile 
          ? (
            `Base de dados: ${selectedFile.name}`
          )
          : (
            "Escolha sua base de dados"
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
