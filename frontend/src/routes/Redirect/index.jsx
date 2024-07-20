import React, { useEffect } from 'react';

export const Redirect = ({ to }) => {
  useEffect(() => {
    
    setTimeout(() => {
      window.location.href = to;
    }, 3000);
    
  }, []);

  return(
    <div></div>
  )
}

