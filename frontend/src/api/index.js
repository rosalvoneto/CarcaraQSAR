
// Retorna projetos ativados
export const searchProjects = async () => {
  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/projects/`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
  })

  let dataResponse = await response.json();
  if(response.status == 200) {
    console.log(dataResponse);
  } else {
    console.log(`Status: ${response.status}`);
    console.log('Erro interno do servidor!');
  }
  return dataResponse;
}

// Retorna projetos desativados
export const searchDeactivatedProjects = async () => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/deactivated_projects/`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
  })

  let dataResponse = await response.json();
  if(response.status == 200) {
    console.log(dataResponse);
  } else {
    console.log(`Status: ${response.status}`);
    console.log('Erro interno do servidor!');
  }
  return dataResponse;
}

// Desativa projeto
export const activateProject = async (projectID) => {
  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/activate_project/${projectID}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({})
  })

  let dataResponse = await response.json();
  if(response.status == 200) {
    console.log(dataResponse);
  } else {
    console.log(`Status: ${response.status}`);
    console.log('Erro interno do servidor!');
  }
}

// Desativa projeto
export const deactivateProject = async (projectID) => {
  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/deactivate_project/${projectID}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({})
  })

  let dataResponse = await response.json();
  if(response.status == 200) {
    console.log(dataResponse);
  } else {
    console.log(`Status: ${response.status}`);
    console.log('Erro interno do servidor!');
  }
}

// Remove projeto
export const removeProject = async (projectID) => {
  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/delete_project/${projectID}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({})
  })

  let dataResponse = await response.json();
  if(response.status == 200) {
    console.log(dataResponse);
  } else {
    console.log(`Status: ${response.status}`);
    console.log('Erro interno do servidor!');
  }
}