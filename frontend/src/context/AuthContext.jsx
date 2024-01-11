import { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import Cookies from 'js-cookie';

const AuthContext = createContext();
export default AuthContext;


export const AuthProvider = ({ children }) => {

  const [decodifiedToken, setDecodifiedToken] = useState(null);

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

      console.log(dataResponse)
      Cookies.set('jwt_token', dataResponse.access, { 
        secure: true,
        sameSite: 'strict' 
      });

      setDecodifiedToken(jwtDecode(dataResponse.access));

      window.location.href = '/home';

    } else {
      console.log(`Status: ${response.status}`);
      alert('Email ou senha incorretas!');
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