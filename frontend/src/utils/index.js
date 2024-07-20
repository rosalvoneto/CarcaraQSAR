
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

export function transposeMatrix(matrix) {
  const lines = matrix.length;
  const columns = matrix[0].length;

  // Crie uma nova matrix transposta
  const transposedMatrix = [];
  for (let i = 0; i < columns; i++) {
    transposedMatrix[i] = [];
    for (let j = 0; j < lines; j++) {
      transposedMatrix[i][j] = matrix[j][i];
    }
  }

  return transposedMatrix;
}

export function convertJsonObjectInMatrix(jsonData) {
  // Obter todas as chaves dos objetos
  let allKeys = Array.from(jsonData.reduce((keys, entry) => {
    Object.keys(entry).forEach(key => keys.add(key));
    return keys;
  }, new Set()));

  // Criar uma matrix a partir dos objetos, incluindo apenas as chaves conhecidas
  let matrix = jsonData.map(function(entry) {
    return allKeys.map(key => entry[key]);
  });

  matrix.splice(0, 0, allKeys);

  return matrix;
}