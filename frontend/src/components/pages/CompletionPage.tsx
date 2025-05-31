import React from 'react';
import { Award, Home } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const CompletionPage: React.FC = () => {
  const { userName, restartJourney } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-4xl px-4 relative">
        <div className="backdrop-blur-sm bg-white/30 rounded-3xl border border-white/50 shadow-xl p-12 text-center">
          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-sky-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-xl">
                <Award size={64} />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">
            Congratulations, {userName}!
          </h1>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-2xl text-sky-900/80 mb-8 font-light">
              You've finished your stand up against bullying journey! You now have the knowledge to create positive change and support others.
            </p>
            
            <div className="bg-sky-100/50 rounded-2xl p-8 mb-10 border border-sky-200/50">
              <h3 className="text-2xl font-bold text-sky-900 mb-4">Your Achievement</h3>
              <p className="text-lg text-sky-800/80">
                As a Bullying Awareness Champion, you've learned valuable skills that can help create a safer and more supportive community.
              </p>
            </div>
            
            <Button
              onClick={restartJourney}
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-700 hover:to-teal-600 transition-all duration-500 transform hover:scale-[1.02]"
              icon={<Home size={24} />}
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        <div className="flex items-center bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50">
          <Award className="mr-2 text-sky-500" size={24} />
          <span className="font-medium text-sky-900">Bullying Awareness Champion</span>
        </div>
        <div className="flex items-center bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50">
          <Award className="mr-2 text-teal-500" size={24} />
          <span className="font-medium text-sky-900">Journey Completed</span>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;