import { createContext, useContext, useState } from 'react';

import AuthContext from './AuthContext';

import { getProject } from '../api/project';

const ProjectContext = createContext();
export default ProjectContext;


export const ProjectProvider = ({ children }) => {

  const { authTokens } = useContext(AuthContext);

  const [projectDetails, setProjectDetails] = useState({});

  const setProjectInfomation = (projectID) => {
    getProject(projectID, authTokens.access)
    .then((response) => {
      setProjectDetails(response.projectData);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  let contextData = {
    setProjectInfomation: setProjectInfomation,
    projectDetails: projectDetails,
  }
  
  return(
    <ProjectContext.Provider value={contextData}>
      { children }
    </ProjectContext.Provider>
  )
}