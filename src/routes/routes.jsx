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
      <DefaultPage>
        <Switch>
          <Route path="/" element={<Login />} />

          <Route path="/home" element={<Home />} />
          <Route path="/new" element={<NewProject />} />

          <Route path="/database" element={<Database />} />
          <Route path="/pre-processing" element={<PreProcessing />} />
          <Route path="/variables-selection" element={<VariablesSelection />} />
          <Route path="/training" element={<Training />} />
          <Route path="/results" element={<Results />} />
          <Route path="/outliers" element={<Outliers />} />

        </Switch>
      </DefaultPage>
    </BrowserRouter>
  );
};
