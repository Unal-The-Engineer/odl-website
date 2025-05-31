import React from 'react';
import { useAppContext } from '../../context/AppContext';
import ModuleNavigation from '../modules/ModuleNavigation';
import { BookOpen, CheckCircle, Lock } from 'lucide-react';

const EducationPage: React.FC = () => {
  const { userName, activeModuleId, modules } = useAppContext();
  
  const activeModule = modules.find(module => module.id === activeModuleId);
  const ActiveModuleComponent = activeModule?.component;

  const getModuleIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-teal-500" />;
      case 'locked':
        return <Lock className="text-sky-300" />;
      default:
        return <BookOpen className="text-sky-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative bg-white/30 backdrop-blur-sm border-b border-white/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-sky-900">Bullying Awareness Journey</h1>
            <div className="text-lg text-sky-800">
              <span className="font-normal">Welcome, </span>
              <span className="font-semibold">{userName}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-grow flex flex-col md:flex-row p-4 gap-6 relative">
        <aside className="w-full md:w-1/4 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6 self-start">
          <h2 className="text-xl font-bold mb-6 text-sky-900">Your Progress</h2>
          
          <ModuleNavigation 
            modules={modules} 
            activeModuleId={activeModuleId}
            getModuleIcon={getModuleIcon}
          />
          
          <div className="mt-6 bg-sky-100/50 rounded-xl p-4 border border-sky-200/50">
            <p className="text-sm text-sky-800">
              Complete all modules to earn your Bullying Awareness Champion badge!
            </p>
          </div>
        </aside>

        <main className="w-full md:w-3/4 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
          {ActiveModuleComponent ? (
            <ActiveModuleComponent />
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-xl text-sky-800">Select a module to begin your journey</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EducationPage;