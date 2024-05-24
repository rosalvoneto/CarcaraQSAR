
// Salva configurações da seleção de variáveis 
export const setVariablesSettings = async (
  projectID, 
  algorithm, algorithmParameters, 
  removeConstantVariables, listOfVariables, accessToken
) => {

  const listOfVariablesString = JSON.stringify(listOfVariables)
  const parametersString = JSON.stringify(algorithmParameters)

  const formData = new FormData();
  formData.append('project_id', projectID);
  formData.append('algorithm', algorithm);
  formData.append('algorithm_parameters', parametersString);
  formData.append('remove_constant_variables', removeConstantVariables);
  formData.append('list_of_variables', listOfVariablesString);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/training/set_settings`, {
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

// Resgata configurações da seleção de variáveis
export const getVariablesSettings = async (
  projectID, accessToken
) => {

  const formData = new FormData();
  formData.append('project_id', projectID);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/training/get_settings?project_id=${projectID}`, {
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

// Remover linhas do Database
export const removeRowsOfDatabase = async(projectID, rowsToRemoveString, accessToken) => {

  const formData = new FormData();
  formData.append('project_id', projectID);
  formData.append('rows', rowsToRemoveString);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/variables-selection/remove_rows`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
      body: formData,
  })

  console.log("Aaqui")

  let dataResponse = await response.json();
  if(response.status == 200) {

    console.log(dataResponse);
    return true;
    
  } else {
    console.log(`Status: ${response.status}`);
    return false;
  }
}