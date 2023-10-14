import { Route, Routes as Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { NotFound } from "../pages/NotFound";
import { Login } from "../pages/Login";

export const Routes = () => {
  return (
    <BrowserRouter >
      <Switch>
        <Route path="*" Component={NotFound} />
        <Route path="/" Component={Login} />
      </Switch>
    </BrowserRouter>
  );
};
