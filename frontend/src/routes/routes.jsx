import { Route, Routes as Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import Home from "../pages/Home";
import NewProject from "../pages/NewProject";
import Database from "../pages/Database";
import PreProcessing from "../pages/PreProcessing";
import DefaultPage from "../pages/DefaultPage";
import VariablesSelection from "../pages/VariablesSelection";
import Training from "../pages/Training";
import Results from "../pages/Results";
import Outliers from "../pages/Outliers";
import TrashPage from "../pages/TrashPage";
import SharedPage from "../pages/SharedPage";
import Prevision from "../pages/Prevision";

import { Redirect } from "./Redirect";

export const Routes = () => {

  const isAuthenticated = true;

  return (
    <BrowserRouter >
        <Switch>
          <Route path="/" 
            element={
              <Login />
            } 
          />

          <Route path="/home" element={
              isAuthenticated ? (
                <DefaultPage>
                  <Home />
                </DefaultPage>
              ) : (
                <Redirect to='/' />
              )
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
          <Route path="/:projectID/variables-selection" 
            element={
              <DefaultPage>
                <VariablesSelection />
              </DefaultPage>
            } 
          />
          <Route path="/:projectID/training" 
            element={
              <DefaultPage>
                <Training />
              </DefaultPage>
            } 
          />
          <Route path="/:projectID/results" 
            element={
              <DefaultPage>
                <Results />
              </DefaultPage>
            } 
          />
          <Route path="/:projectID/prevision" 
            element={
              <DefaultPage>
                <Prevision />
              </DefaultPage>
            } 
          />
          <Route path="/:projectID/outliers" 
            element={
              <DefaultPage>
                <Outliers />
              </DefaultPage>
            } 
          />
        </Switch>
    </BrowserRouter>
  );
};
