import React from 'react';
import { Module } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface ModuleNavigationProps {
  modules: Module[];
  activeModuleId: number | null;
  getModuleIcon: (status: string) => React.ReactNode;
}

const ModuleNavigation: React.FC<ModuleNavigationProps> = ({
  modules,
  activeModuleId,
  getModuleIcon
}) => {
  const { selectModule } = useAppContext();

  return (
    <nav className="space-y-4">
      {modules.map((module) => (
        <button
          key={module.id}
          className={`w-full text-left p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 flex items-center gap-4
            ${module.status === 'locked' ? 
              'bg-white/20 border-white/30 opacity-60 cursor-not-allowed' : 
              module.id === activeModuleId ?
                'bg-sky-100/50 border-sky-200 shadow-md transform scale-[1.02]' :
                module.status === 'completed' ?
                  'bg-teal-100/30 border-teal-200/50 hover:bg-teal-100/50' :
                  'bg-white/30 border-white/50 hover:bg-white/50'
            }`}
          onClick={() => module.status !== 'locked' && selectModule(module.id)}
          disabled={module.status === 'locked'}
        >
          <div className="flex-shrink-0">
            {getModuleIcon(module.status)}
          </div>
          <div>
            <h3 className="font-semibold text-sky-900">{module.title}</h3>
            <p className="text-sm text-sky-800/70">{module.description}</p>
          </div>
        </button>
      ))}
    </nav>
  );
};

export default ModuleNavigation;