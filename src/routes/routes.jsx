import { Route, Routes as Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { NotFound } from "../pages/NotFound";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { NewProject } from "../pages/NewProject";

export const Routes = () => {
  return (
    <BrowserRouter >
      <Switch>
        <Route path="*" Component={NotFound} />
        <Route path="/" Component={Login} />
        <Route path="/home" Component={Home} />
        <Route path="/new" Component={NewProject} />
      </Switch>
    </BrowserRouter>
  );
};
