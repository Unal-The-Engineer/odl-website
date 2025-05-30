import React, { useState } from 'react';
import { Heart, Shield, Users, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

const LandingPage: React.FC = () => {
  const { setUserName, startJourney } = useAppContext();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please tell us your name first!');
      return;
    }
    
    setUserName(name);
    startJourney();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-4xl px-4 relative">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 font-display">
            <span className="text-sky-800">Create</span>
            <br />
            <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
              Peace
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-sky-900/80 max-w-2xl mx-auto font-light">
            Join our community in building a peaceful world. Learn how to promote understanding and support your friends.
          </p>
        </div>

        <div className="max-w-md mx-auto backdrop-blur-sm bg-white/30 p-8 rounded-3xl border border-white/50 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="What's your name?"
                className="w-full px-6 py-4 text-lg bg-white/50 backdrop-blur-sm border-2 border-sky-200 rounded-2xl focus:border-sky-400 focus:ring-2 focus:ring-sky-300/50 transition-all duration-300 outline-none placeholder-sky-400/50"
              />
              {error && (
                <p className="absolute -bottom-6 left-0 text-red-600 text-sm">
                  {error}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              variant="accent" 
              size="lg" 
              className="w-full group bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-700 hover:to-teal-600 transition-all duration-500 transform hover:scale-[1.02]"
              icon={<ArrowRight className="group-hover:translate-x-1 transition-transform" />}
            >
              Begin Your Journey
            </Button>
          </form>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
            <Heart size={32} className="text-sky-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sky-900 mb-2">Foster Understanding</h3>
            <p className="text-sky-800/70">Learn how empathy creates lasting connections</p>
          </div>
          
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
            <Shield size={32} className="text-teal-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sky-900 mb-2">Promote Peace</h3>
            <p className="text-sky-800/70">Discover ways to create harmony in your community</p>
          </div>
          
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
            <Users size={32} className="text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sky-900 mb-2">Build Unity</h3>
            <p className="text-sky-800/70">Create strong bonds through mutual respect</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-sky-100/50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default LandingPage;