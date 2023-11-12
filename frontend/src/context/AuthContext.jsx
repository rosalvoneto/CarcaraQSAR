import { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [authTokens, setAuthTokens] = useState(null);

  const loginUser = async (e) => {

    e.preventDefault();
    console.log('Form submitted');
    console.log('username:', e.target.username.value);
    console.log('password:', e.target.password.value);

    let response = await fetch('http://0.0.0.0:8000/auth/token/', {
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
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
    } else {
      alert('Nome de usuário ou senha incorretas!');
    }

    console.log('data', data);
  }

  let contextData = {
    user: user,
    loginUser: loginUser
  }
  
  return(
    <AuthContext.Provider value={contextData}>
      { children }
    </AuthContext.Provider>
  )
}