import Cookies from "js-cookie";

// Função para obter o token CSRF dos cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  console.log("VALOR DO COOKIE:", cookieValue);
  return cookieValue;
}

export const loginUser = async (e) => {
  e.preventDefault();

  const csrfToken = getCookie('csrftoken');

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value
    })
  })

  let dataResponse = await response.json();
  if(response.status == 200) {

    Cookies.set('jwt_tokens', JSON.stringify(dataResponse), { 
      secure: false,
      sameSite: 'strict' 
    });
    window.location.href = '/home';

    return dataResponse;

  } else {
    console.log(`Status: ${response.status}`);
    alert('Email ou senha incorretas!');

    return null;
  }
}

export const logoutUser = () => {
  Cookies.remove('jwt_tokens');
  window.location.href = '/';
}

export const createUser = async (e) => {
  e.preventDefault();

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/user/create_user`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username: e.target.username.value,
        email: e.target.email.value,
        country: e.target.country.value,
        institution: e.target.institution.value,
        password: e.target.password.value
    })
  })

  let dataResponse = await response.json();
  if(response.status == 200) {

    console.log(dataResponse);
    return true;

  } else {
    console.log(`Status: ${response.status}`);
    alert('Erro interno do servidor!');
    return false;
  }
}
