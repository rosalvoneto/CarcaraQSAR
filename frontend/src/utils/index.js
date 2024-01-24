
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
  let rows = CSVString.split('\n');
  const startIndexToRemove = 6;
  rows.splice(startIndexToRemove);

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

export function convertJsonObjectInMatrix(jsonData) {
  // Obter todas as chaves dos objetos
  let allKeys = Array.from(jsonData.reduce((keys, entry) => {
    Object.keys(entry).forEach(key => keys.add(key));
    return keys;
  }, new Set()));

  // Criar uma matriz a partir dos objetos, incluindo apenas as chaves conhecidas
  let matrix = jsonData.map(function(entry) {
    return allKeys.map(key => entry[key]);
  });

  matrix.splice(0, 0, allKeys);

  return matrix;
}