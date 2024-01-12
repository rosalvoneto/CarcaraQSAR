import Cookies from "js-cookie";

export const loginUser = async (e) => {
  e.preventDefault();

  let response = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value
    })
  })

  let dataResponse = await response.json();
  if(response.status == 200) {

    Cookies.set('jwt_tokens', JSON.stringify(dataResponse), { 
      secure: true,
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
