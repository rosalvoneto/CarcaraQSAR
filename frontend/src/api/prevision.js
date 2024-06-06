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