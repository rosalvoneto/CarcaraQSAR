import React, { useEffect } from 'react';

export const Redirect = ({ to }) => {
  useEffect(() => {
    
    console.log("Indo para:", to);

    setTimeout(() => {
      window.location.href = to;
    }, 3000);
    
  }, []);

  return(
    <div></div>
  )
}

