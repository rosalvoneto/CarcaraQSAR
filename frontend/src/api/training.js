
// Salva configurações do treinamento
export const setTrainingSettings = async (
  projectID, algorithm, parameters, withFullSet, accessToken
) => {

  const parametersString = JSON.stringify(parameters)

  const formData = new FormData();
  formData.append('project_id', projectID);
  formData.append('algorithm', algorithm);
  formData.append('parameters', parametersString);
  formData.append('with_full_set', withFullSet);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/training/set_training_settings`, {
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

// Resgata configurações do treinamento
export const getTrainingSettings = async (
  projectID, accessToken
) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/training/get_training_settings?project_id=${projectID}`, {
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

// Treinamento
export const train = async (
  projectID, accessToken
) => {

  const formData = new FormData();
  formData.append('project_id', projectID);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/training/train`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
      body: formData,
  })
  
  let dataResponse = await response.json();
  console.log(dataResponse.message);

  return response;
}

// Resgata gráficos do treinamento
export const getTrainingGraphs = async (
  projectID, accessToken
) => {

  const formData = new FormData();
  formData.append('project_id', projectID);

  const urlDomain = import.meta.env.VITE_REACT_APP_BACKEND_LINK;

  const urls = [
    `${urlDomain}/training/get_importance?project_id=${projectID}`,
    `${urlDomain}/training/get_leave_one_out?project_id=${projectID}`,
    `${urlDomain}/training/get_k_fold_cross_validation?project_id=${projectID}`,
    `${urlDomain}/training/get_y_scrambling?project_id=${projectID}`,
    `${urlDomain}/training/get_bootstrap?project_id=${projectID}`,
  ];

  const requests = urls.map(url => {
    return fetch(
    url,
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
    }
  )});

  const dataResponses = await Promise.all(requests);

  let imagesBlob = []
  for(let i = 0; i < dataResponses.length; i++) {
      const imageBlob = await dataResponses[i].blob();
      imagesBlob.push(imageBlob);
  }
  let imagesURL = []
  for(let i = 0; i < imagesBlob.length; i++) {
      const imageUrl = URL.createObjectURL(imagesBlob[i]);
      imagesURL.push(imageUrl);
  }

  return imagesURL;
}

// Resgata progresso no treinamento 
export const getTrainingProgress = async (
  projectID, accessToken
) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/training/get_training_progress?project_id=${projectID}`, {
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

// Resgata progresso no treinamento 
export const getBootstrapDetails = async (
  projectID, accessToken
) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/training/get_bootstrap_details?project_id=${projectID}`, {
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