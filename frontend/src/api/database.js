
// Envia Base de dados para o backend
export const sendDatabase = async (
  projectID, selectedFile, separator, accessToken
) => {

  const formData = new FormData();
  formData.append('project_id', projectID);
  formData.append('file', selectedFile);
  formData.append('separator', separator);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/database/send`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
      body: formData,
  })

  let dataResponse = await response.json();
  if(response.status == 200) {

    console.log(dataResponse);
    return true;
    
  } else {
    console.log(`Status: ${response.status}`);
    return false;
  }
}

// Recebe Base de dados do backend
export const getDatabase = async (projectID, accessToken, transposed) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/database/receive?project_id=${projectID}&transposed=${transposed}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
  })

  let dataResponse = await response.json();
  if(response.status == 200) {

    console.log(dataResponse);
    
  } else {
    console.log(`Status: ${response.status}`);
    alert('Erro interno do servidor!');
  }

  return dataResponse;
}

// Recuperar variáveis do Database
export const getVariables = async (projectID, accessToken) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/database/variables?project_id=${projectID}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
  })

  let dataResponse = await response.json();
  if(response.status == 200) {

    console.log(dataResponse);
    
  } else {
    console.log(`Status: ${response.status}`);
    alert('Erro interno do servidor!');
  }

  return dataResponse;
}

// Retorna Histograma de uma variável específica
export const getHistogram = async (projectID, variable, divisions, accessToken) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/database/histogram?project_id=${projectID}&variable=${variable}&divisions=${divisions}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
  })

  let dataResponse = await response.json();
  if(response.status == 200) {

    console.log(dataResponse);
    
  } else {
    console.log(`Status: ${response.status}`);
    alert('Erro interno do servidor!');
  }

  return dataResponse;
}

// Retorna BoxPlot de uma variável específica
export const getBoxPlot = async (projectID, variable, accessToken) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/database/box_plot?project_id=${projectID}&variable=${variable}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
  })

  let dataResponse = await response.json();
  if(response.status == 200) {

    console.log(dataResponse);
    
  } else {
    console.log(`Status: ${response.status}`);
    alert('Erro interno do servidor!');
  }

  return dataResponse;
}

// Converte Base de dados de SMILES para CSV
export const convertDatabase = async (selectedFile, accessToken) => {

  const formData = new FormData();
  formData.append('file', selectedFile);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/database/send`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
      body: formData,
  })

  let dataResponse = await response.json();
  if(response.status == 200) {

    console.log(dataResponse);
    
  } else {
    console.log(`Status: ${response.status}`);
  }
  return dataResponse;
}