
// Cria projeto
export const createProject = async (e, accessToken) => {
  e.preventDefault();
  console.log(accessToken)

  const name = e.target.name.value;
  const description = e.target.description.value;

  if(name == "" || description == "") {
    return alert("Preencha os campos corretamente!")
  }

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/new/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + String(accessToken)
      },
      body: JSON.stringify({
        project_name: name,
        project_description: description
      })
  })

  let dataResponse = await response.json();
  if(response.status == 200) {

    console.log(dataResponse);
    window.location.href = '/home';
    
  } else {
    console.log(`Status: ${response.status}`);
    alert('Erro interno do servidor!');
  }
}

// Retorna projetos ativados
export const searchProjects = async (searchValue, accessToken) => {
  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/projects?query=${searchValue}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + String(accessToken)
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
export const searchDeactivatedProjects = async (searchValue) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/deactivated_projects?query=${searchValue}`, {
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

// Retorna projetos compartilhados
export const searchSharedProjects = async (searchValue) => {

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/shared_projects?query=${searchValue}`, {
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

// Ativa projeto
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

// Compartilha projeto
export const shareProject = async (projectID) => {
  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/share_project/${projectID}`, {
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

// Descompartilha projeto
export const deshareProject = async (projectID) => {
  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/project/deshare_project/${projectID}`, {
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