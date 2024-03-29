import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import styles from './styles.module.css';

import { NavigationBarWidth } from '../../settings';

import NavigationBar from '../../components/NavigationBar';
import ProjectContext from '../../context/ProjectContext';

export function DefaultPage({ children }) {

  const { projectID } = useParams();
  const { projectDetails, setProjectInfomation } = useContext(ProjectContext);

  useEffect(() => {
    if(projectID != undefined) {
      console.log("ID do projeto:", projectID);
      setProjectInfomation(projectID);
    }
  }, [projectID]);

  return(
    <div className={styles.container}>
      <NavigationBar />
      <div 
        className={styles.pageContentContainer}
        style={{ width: `calc(100% - ${NavigationBarWidth}px)` }}
      >
        { children }
      </div>
    </div>
  )
}