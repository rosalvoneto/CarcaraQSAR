import './App.css';

import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';

import { Routes } from './routes/routes';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Routes />
      </ProjectProvider>
    </AuthProvider>
  )
}

export default App
