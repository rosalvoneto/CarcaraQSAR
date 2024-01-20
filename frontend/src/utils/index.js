
export const convertStringToFile = (stringFile, fileName) => { 
  const blob = new Blob([stringFile], { 
    type: 'application/octet-stream' 
  });
  const file = new File([blob], fileName, {
    type: 'application/octet-stream' 
  });

  console.log(file);
  return file;
};

export const convertFileToString = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

export const convertStringToCSVMatrix = (CSVString, separator) => {
  const rows = CSVString.split('\n');
  let csvData = rows.map(row => row.split(separator));
  csvData.pop();

  while(csvData[csvData.length - 1][0] == '') {
    csvData.splice(csvData.length - 1, 1);
  }

  return csvData;
};

export function transporMatriz(matriz) {
  const linhas = matriz.length;
  const colunas = matriz[0].length;

  // Crie uma nova matriz transposta
  const matrizTransposta = [];
  for (let i = 0; i < colunas; i++) {
    matrizTransposta[i] = [];
    for (let j = 0; j < linhas; j++) {
      matrizTransposta[i][j] = matriz[j][i];
    }
  }

  return matrizTransposta;
}