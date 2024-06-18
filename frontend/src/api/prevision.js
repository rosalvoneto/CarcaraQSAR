// fazer previsão com base nos valores das características das moléculas
export const makePrevision = async(
  projectID, variablesValues, accessToken
) => {

  const variablesValuesString = JSON.stringify(variablesValues);

  const formData = new FormData();
  formData.append('project_id', projectID);
  formData.append('variables_values', variablesValuesString);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/prevision/make_prevision`, {
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

// Criar modelo no banco de dados
export const createModel = async(
  projectID, accessToken
) => {

  const formData = new FormData();
  formData.append('project_id', projectID);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/prevision/create_model`, {
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

// Verificar se tem modelo no banco de dados
export const getModel = async(
  projectID, accessToken
) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/prevision/has_model?project_id=${projectID}`, {
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
  }
  return dataResponse;
}

// Excluir o modelo no banco de dados
export const deleteModel = async(
  projectID, accessToken
) => {

  const formData = new FormData();
  formData.append('project_id', projectID);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/prevision/delete_model`, {
      method: 'DELETE',
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

// Fazer download do modelo
export const downloadModel = async(
  projectID, accessToken
) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/prevision/download_model?project_id=${projectID}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
  })

  console.log(response);

  let dataResponse = await response.text();
  if(response.status == 200) {
  } else {
    console.log(`Status: ${response.status}`);
  }
  return dataResponse;
}

// Fazer download do scaler
export const downloadScaler = async(
  projectID, accessToken
) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/prevision/download_scaler?project_id=${projectID}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
  })

  console.log(response);

  let dataResponse = await response.text();
  if(response.status == 200) {
  } else {
    console.log(`Status: ${response.status}`);
  }
  return dataResponse;
}

// fazer previsão usando o próprio Database
export const calculateAll = async(
  projectID, accessToken
) => {

  const formData = new FormData();
  formData.append('project_id', projectID);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/prevision/calculate_all`, {
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

// Fazer download das estimativas
export const downloadEstimation = async(
  projectID, accessToken
) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/prevision/download_estimation?project_id=${projectID}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
  })

  console.log(response);

  let dataResponse = await response.text();
  if(response.status == 200) {
  } else {
    console.log(`Status: ${response.status}`);
  }
  return dataResponse;
}