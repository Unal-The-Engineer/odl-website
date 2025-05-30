import React, { createContext, useContext, useState } from 'react';
import { Module, AppState } from '../types';
import AnimationModule from '../components/modules/AnimationModule';
import QuizModule from '../components/modules/QuizModule';
import ComicModule from '../components/modules/ComicModule';

const initialModules: Module[] = [
  {
    id: 1,
    title: 'Info Capsule',
    description: 'Watch the animation',
    status: 'unlocked',
    component: AnimationModule,
  },
  {
    id: 2,
    title: 'Fun Quiz',
    description: '"Who Wants to Be a Millionaire" style',
    status: 'locked',
    component: QuizModule,
  },
  {
    id: 3,
    title: 'Comic World',
    description: 'Read the story',
    status: 'locked',
    component: ComicModule,
  },
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<'landing' | 'education' | 'completion'>('landing');
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [modules, setModules] = useState<Module[]>(initialModules);

  const startJourney = () => {
    setCurrentPage('education');
    setActiveModuleId(1); // Start with the first module
  };

  const selectModule = (id: number) => {
    const module = modules.find(m => m.id === id);
    if (module && module.status !== 'locked') {
      setActiveModuleId(id);
    }
  };

  const completeModule = (id: number) => {
    setModules(prevModules => {
      const updatedModules = prevModules.map(module => {
        if (module.id === id) {
          return { ...module, status: 'completed' };
        }
        if (module.id === id + 1) {
          return { ...module, status: 'unlocked' };
        }
        return module;
      });
      
      // Check if all modules are completed
      const allCompleted = updatedModules.every(module => module.status === 'completed');
      if (allCompleted) {
        setTimeout(() => {
          setCurrentPage('completion');
        }, 500);
      } else {
        // Auto-select next module if available
        const nextModule = updatedModules.find(m => m.id === id + 1);
        if (nextModule && nextModule.status === 'unlocked') {
          setActiveModuleId(nextModule.id);
        }
      }
      
      return updatedModules;
    });
  };

  const goToCompletion = () => {
    setCurrentPage('completion');
  };

  const restartJourney = () => {
    setModules(initialModules);
    setCurrentPage('landing');
    setActiveModuleId(null);
  };

  return (
    <AppContext.Provider
      value={{
        userName,
        currentPage,
        activeModuleId,
        modules,
        setUserName,
        startJourney,
        selectModule,
        completeModule,
        goToCompletion,
        restartJourney,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};