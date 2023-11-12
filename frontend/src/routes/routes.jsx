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

import { PrivateRoute } from "../utils/PrivateRoute";
import { AuthProvider } from "../context/AuthContext";

export const Routes = () => {
  return (
    <AuthProvider>
      <BrowserRouter >
        
          <Switch>

            <Route path="/" 
              element={
                <Login />
              } 
            />
            
            <Route path="/home" 
              element={
                <DefaultPage>
                  <Home />
                </DefaultPage>
              }
            />

            <Route path="/new" 
              element={
                <DefaultPage>
                  <NewProject />
                </DefaultPage>
              } 
            />
            <Route path="/database" 
              element={
                <DefaultPage>
                  <Database />
                </DefaultPage>
              } 
            />
            <Route path="/pre-processing" 
              element={
                <DefaultPage>
                  <PreProcessing />
                </DefaultPage>
              }
            />
            <Route path="/variables-selection" 
              element={
                <DefaultPage>
                  <VariablesSelection />
                </DefaultPage>
              } 
            />
            <Route path="/training" 
              element={
                <DefaultPage>
                  <Training />
                </DefaultPage>
              } 
            />
            <Route path="/results" 
              element={
                <DefaultPage>
                  <Results />
                </DefaultPage>
              } 
            />
            <Route path="/outliers" 
              element={
                <DefaultPage>
                  <Outliers />
                </DefaultPage>
              } 
            />

          </Switch>
          
      </BrowserRouter>
    </AuthProvider>
  );
};
