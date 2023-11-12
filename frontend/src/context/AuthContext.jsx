import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [authTokens, setAuthTokens] = useState(null);

  const loginUser = (e) => {

    e.preventDefault();
    console.log('Form submitted');

    // let response = fetch('http://0.0.0.0:8000/auth/token/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     username: null,
    //     password: null
    //   })
    // })
  }

  let contextData = {
    loginUser: loginUser
  }
  
  return(
    <AuthContext.Provider value={contextData}>
      { children }
    </AuthContext.Provider>
  )
}