
// Salva configurações do treinamento
export const setTrainingSettings = async (
  projectID, algorithm, parameters, withFullSet, accessToken
) => {

  const parametersString = JSON.stringify(parameters);

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
    return true;
  } else {
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
  console.log(dataResponse)
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
    if(dataResponses[i].status != 404) {
      const imageBlob = await dataResponses[i].blob();
      imagesBlob.push(imageBlob);
    } else {
      imagesBlob.push(null);
    }
  }
  let imagesURL = []
  for(let i = 0; i < imagesBlob.length; i++) {
    if(imagesBlob[i]) {
      const imageUrl = URL.createObjectURL(imagesBlob[i]);
      imagesURL.push(imageUrl);
    } else {
      imagesURL.push(null);
    }
  }

  return imagesURL;
}

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
  return dataResponse;
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
  return dataResponse;
}

// Seta progresso no treinamento
export const setTrainingProgress = async (
  projectID, accessToken, progressValue, maximumValue
) => {

  const formData = new FormData();
  formData.append('project_id', projectID);
  formData.append('progress_value', progressValue);
  formData.append('maximum_value', maximumValue);

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/training/set_training_progress`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + String(accessToken)
      },
      body: formData,
  })
  
  let dataResponse = await response.json();
  return dataResponse;
}