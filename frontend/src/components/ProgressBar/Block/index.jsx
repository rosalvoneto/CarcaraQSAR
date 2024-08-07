
import { CaretRight } from '@phosphor-icons/react';

import styles from './styles.module.css';

import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import ProjectContext from '../../../context/ProjectContext'; 

export function Block({ state, useImage, progress }) {

  const { projectDetails } = useContext(ProjectContext);

  const activeText = state.index <= progress;
  const activeImage = state.index < progress;

  const classNamesText = `${styles.text} ${
    activeText
    ? styles.activatedText
    : styles.deactivatedText
  }`;

  const classNamesImage = `${styles.image} ${
    activeImage
    ? styles.activatedImage
    : styles.deactivatedImage
  }`;

  const colorCaretRight = activeImage ? 
    'var(--white-color-1)' : 'var(--black-color-1)';

  const navigate = useNavigate();
  const handleTo = (state) => {
    
    navigate(
      `/${projectDetails.id}${state.href}`, { state: state.stateToPass }
    );
  }

  return(
    <div key={state.index} style={{ display: 'flex' }}>
      <p 
        className={classNamesText}
        style={Math.floor(state.index) != state.index ? { fontSize: 12 } : {}}
        onClick={() =>  handleTo(state)}
      >
        {state.name}
      </p>
      {
        useImage &&
        <div className={classNamesImage}>
          <CaretRight size={16} color={colorCaretRight} />
        </div>
      }
    </div>
  )
}