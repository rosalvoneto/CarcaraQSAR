import { Route, Routes as Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

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
import { TrashPage } from "../pages/TrashPage";
import { SharedPage } from "../pages/SharedPage";

import { AuthProvider } from "../context/AuthContext";
import { ProjectProvider } from "../context/ProjectContext";

export const Routes = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
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

              <Route path="/shared" 
                element={
                  <DefaultPage>
                    <SharedPage />
                  </DefaultPage>
                } 
              />

              <Route path="/trash" 
                element={
                  <DefaultPage>
                    <TrashPage />
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
              <Route path="/:projectID/database" 
                element={
                  <DefaultPage>
                    <Database />
                  </DefaultPage>
                } 
              />
              <Route path="/:projectID/pre-processing" 
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
      </ProjectProvider>
    </AuthProvider>
  );
};
