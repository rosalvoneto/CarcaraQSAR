import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import Cookies from 'js-cookie';
import { createUser, loginUser, logoutUser } from '../api/user';

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
  const [loading, setLoading] = useState(true);

  const loginUserWithState = async (e) => {
    const dataResponse = await loginUser(e);

    if(dataResponse) {
      setAuthTokens(dataResponse);
      setDecodifiedAccessToken(dataResponse.access)
    }
  }

  const logoutUserWithState = () => {
    logoutUser();
    setAuthTokens(null);
    setDecodifiedAccessToken(null);
  }

  const createUserWithState = async (e) => {
    const createdUser = await createUser(e);
    if(createdUser) {
      await loginUserWithState(e);
    }
  }

  const uptateToken = async () => {

    let response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_LINK}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          refresh: authTokens.refresh
      })
    })

    let dataResponse = await response.json();
    if(response.status == 200) {

      Cookies.set('jwt_tokens', JSON.stringify(dataResponse), { 
        secure: true,
        sameSite: 'strict' 
      });
      
      setAuthTokens(dataResponse);
      setDecodifiedAccessToken(jwtDecode(dataResponse.access));

    } else {
      logoutUserWithState();
    }
  }

  useEffect(() => {

    const timeInterval = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if(authTokens) {
        uptateToken();
      }
    }, timeInterval)

    return () => clearInterval(interval)

  }, [authTokens, loading]);

  let contextData = {
    decodifiedAccessToken: decodifiedAccessToken,
    authTokens: authTokens,
    createUser: createUserWithState,
    loginUser: loginUserWithState,
    logoutUser: logoutUserWithState,
  }
  
  return(
    <AuthContext.Provider value={contextData}>
      { children }
    </AuthContext.Provider>
  )
}