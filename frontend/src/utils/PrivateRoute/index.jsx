import { Route } from 'react-router-dom';

export const PrivateRoute = ({ children, ...rest }) => {

  console.log('Private route works');

  return(
    <Route {...rest}>
      { children }
    </Route>
  )
}