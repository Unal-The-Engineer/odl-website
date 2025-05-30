export type ModuleStatus = 'locked' | 'unlocked' | 'completed';

export interface Module {
  id: number;
  title: string;
  description: string;
  status: ModuleStatus;
  component: React.ComponentType;
}

export interface AppState {
  userName: string;
  currentPage: 'landing' | 'education' | 'completion';
  activeModuleId: number | null;
  modules: Module[];
  setUserName: (name: string) => void;
  startJourney: () => void;
  selectModule: (id: number) => void;
  completeModule: (id: number) => void;
  goToCompletion: () => void;
  restartJourney: () => void;
}