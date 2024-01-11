import { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import Cookies from 'js-cookie';

const AuthContext = createContext();
export default AuthContext;


export const AuthProvider = ({ children }) => {

  const [decodifiedAccessToken, setDecodifiedAccessToken] = useState(
    () =>
      Cookies.get('jwt_tokens') ? (
        jwtDecode(JSON.parse(Cookies.get('jwt_tokens')).access)
      ) : (
        null
      )
  );
  const [authTokens, setAuthTokens] = useState(
    () =>
      Cookies.get('jwt_tokens') ? (
        JSON.parse(Cookies.get('jwt_tokens'))
      ) : (
        null
      )
  );

  const loginUser = async (e) => {
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
      
      setAuthTokens(dataResponse);
      console.log(authTokens);
      setDecodifiedAccessToken(jwtDecode(dataResponse.access));
      console.log(decodifiedAccessToken);

      window.location.href = '/home';

    } else {
      console.log(`Status: ${response.status}`);
      alert('Email ou senha incorretas!');
    }
  }

  const logoutUser = () => {
    setAuthTokens(null);
    setDecodifiedAccessToken(null);

    Cookies.remove('jwt_tokens');

    window.location.href = '/';
  }

  let contextData = {
    decodifiedAccessToken: decodifiedAccessToken,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser, logoutUser,
  }
  
  return(
    <AuthContext.Provider value={contextData}>
      { children }
    </AuthContext.Provider>
  )
}