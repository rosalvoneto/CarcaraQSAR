import { Route, Routes as Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { NotFound } from "../pages/NotFound";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { NewProject } from "../pages/NewProject";
import { Project } from "../pages/Project";
import { PreProcessamento } from "../pages/PreProcessamento";

export const Routes = () => {
  return (
    <BrowserRouter >
      <Switch>
      </Switch>
      <Switch>
        <Route path="*" Component={NotFound} />
        <Route path="/" Component={Login} />
        <Route path="/home" Component={Home} />
        <Route path="/new" Component={NewProject} />

        <Route path="/project" Component={Project} />
        <Route path="/pre" Component={PreProcessamento} />
      </Switch>
    </BrowserRouter>
  );
};
