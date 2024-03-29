
import { useNavigate, useParams } from 'react-router-dom';

import { useContext, useEffect } from 'react';
import styles from './styles.module.css';

import ProjectContext from '../../context/ProjectContext';

export default function Button({ 
  name, URL, stateToPass, side, action, useStrictURL
}) {
  const { projectID } = useParams();
  const { projectDetails, setProjectInfomation } = useContext(ProjectContext);

  const navigate = useNavigate();

  const actions = () => {
    let toNavigate = true;
    if(action) {
      toNavigate = action();
    }
    if(toNavigate) {
      if(useStrictURL) {
        navigate(URL, { state: stateToPass });
      } else {
        navigate(`/${projectID}${URL}`, { state: stateToPass });
      }
    }
  }


  let style = {};
  if(side == 'right') {
    style.right = 15;
  } else {
    style.left = 15;
  }

  return(
    <div 
      className={styles.container}
      style={style}
    >
      <button 
        className={styles.button}
        onClick={() => actions()}
      >
        { name }
      </button>
    </div>
  )
}