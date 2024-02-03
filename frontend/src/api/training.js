
// Salva configurações de treinamento 
export const setTrainingSettings = async (
  projectID, algorithm, removeVariablesConstants, accessToken
) => {

  const formData = new FormData();
  formData.append('project_id', projectID);
  formData.append('algorithm', algorithm);
  formData.append('remove_variables_constants', removeVariablesConstants);

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

// Resgata configurações de treinamento
export const getTrainingSettings = async (
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