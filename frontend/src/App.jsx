import './App.css';

import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ProjectProvider } from './context/ProjectContext';

import { Routes } from './routes/routes';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <ProgressProvider>
          <Routes />
        </ProgressProvider>
      </ProjectProvider>
    </AuthProvider>
  )
}

export default App
