import { Route, Routes as Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { NotFound } from "../pages/NotFound";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { NewProject } from "../pages/NewProject";
import { Database } from "../pages/Database";
import { PreProcessing } from "../pages/PreProcessing";
import { DefaultPage } from "../pages/DefaultPage";
import VariablesSelection from "../pages/VariablesSelection";
import Training from "../pages/Training";
import Results from "../pages/Results";
import Outliers from "../pages/Outliers";

export const Routes = () => {
  return (
    <BrowserRouter >
      {
        <Switch>
          <Route path="/" Component={Login} />
        </Switch>
      }
      <DefaultPage>
        <Switch>
          <Route path="/home" Component={Home} />
          <Route path="/new" Component={NewProject} />

          <Route path="/database" Component={Database} />
          <Route path="/pre-processing" Component={PreProcessing} />
          <Route path="/variables-selection" Component={VariablesSelection} />
          <Route path="/training" Component={Training} />
          <Route path="/results" Component={Results} />
          <Route path="/outliers" Component={Outliers} />

        </Switch>
      </DefaultPage>
    </BrowserRouter>
  );
};
