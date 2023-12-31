import { createContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Cookies from 'js-cookie';

const AuthContext = createContext();
export default AuthContext;


export const AuthProvider = ({ children }) => {

  const [decodifiedToken, setDecodifiedToken] = useState(null);
  const [authTokens, setAuthTokens] = useState(null);

  const loginUser = async (e) => {
    e.preventDefault();

    console.log(import.meta.env.VITE_REACT_APP_BACKEND_LINK)

    let response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value
      })
    })

    let data = await response.json();
    if(response.status == 200) {

      Cookies.set('jwt_token', data.access, { 
        secure: true,
        sameSite: 'strict' 
      });

      setAuthTokens(data.access);
      setDecodifiedToken(jwtDecode(data.access));
      console.log(decodifiedToken);

      window.location.href = '/home';

    } else {
      alert('Nome de usuário ou senha incorretas!');
    }
  }

  let contextData = {
    decodifiedToken: decodifiedToken,
    loginUser: loginUser
  }
  
  return(
    <AuthContext.Provider value={contextData}>
      { children }
    </AuthContext.Provider>
  )
}