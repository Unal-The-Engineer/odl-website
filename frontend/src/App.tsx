import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LandingPage from './components/pages/LandingPage';
import EducationPage from './components/pages/EducationPage';
import CompletionPage from './components/pages/CompletionPage';

const AppContent: React.FC = () => {
  const { currentPage } = useAppContext();

  return (
    <>
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'education' && <EducationPage />}
      {currentPage === 'completion' && <CompletionPage />}
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;