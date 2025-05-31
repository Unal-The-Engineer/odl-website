import React, { useState, useEffect } from 'react';
import { Award, ArrowRight, ExternalLink } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import { buildApiUrl, API_ENDPOINTS } from '../../config/api';

interface QuizContent {
  type: string;
  title: string;
  description: string;
  quiz_type: string;
  iframe_url: string;
  iframe_html: string;
  completion_method: string;
}

const QuizModule: React.FC = () => {
  const { completeModule } = useAppContext();
  const [quizContent, setQuizContent] = useState<QuizContent | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // Fetch quiz content from backend
    fetch(buildApiUrl(API_ENDPOINTS.MODULE.CONTENT(2)))
      .then(response => response.json())
      .then(data => setQuizContent(data))
      .catch(error => console.error('Error fetching quiz content:', error));
  }, []);

  const handleQuizCompletion = () => {
    setQuizCompleted(true);
  };

  const handleContinue = () => {
    completeModule(2);
  };

  if (!quizContent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-sky-800">Loading quiz content...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="space-y-6">
        <header>
          <h2 className="text-2xl font-bold text-sky-900 mb-2">Quiz Completed!</h2>
          <p className="text-sky-800/80">Great job completing the millionaire quiz.</p>
        </header>

        <div className="text-center py-12 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center text-white mx-auto">
              <Award size={48} />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-sky-900 mb-4">Well Done!</h3>
          <p className="text-lg text-sky-800/80 max-w-md mx-auto mb-8">
            You've successfully completed the millionaire quiz and learned important lessons about bullying awareness and prevention.
          </p>
          
          <Button 
            onClick={handleContinue} 
            variant="primary"
            className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 transition-all duration-300"
            icon={<ArrowRight size={20} />}
          >
            Continue Journey
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-sky-900 mb-2">{quizContent.title}</h2>
        <p className="text-sky-800/80">{quizContent.description}</p>
      </header>

      <div className="bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden">
        <div className="p-4 bg-white/50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Award className="text-sky-500" size={20} />
            <span className="font-medium text-sky-900">Interactive Millionaire Quiz</span>
          </div>
          <a
            href={quizContent.iframe_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sky-600 hover:text-sky-800 text-sm"
          >
            <ExternalLink size={16} />
            <span>Open in new tab</span>
          </a>
        </div>

        <div 
          className="quiz-iframe-container"
          dangerouslySetInnerHTML={{ __html: quizContent.iframe_html }}
        />

        <div className="p-6 bg-white/50">
          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleQuizCompletion}
              variant="primary"
              className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 transition-all duration-300"
              icon={<Award size={20} />}
            >
              I Completed the Quiz
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 mb-2">How to Play:</h3>
            <ul className="list-disc list-inside space-y-1 text-amber-700 text-sm">
              <li>Answer questions correctly to progress</li>
              <li>Use lifelines if you get stuck</li>
              <li>Complete the quiz to unlock the next module</li>
              <li>Click "I Completed the Quiz" when finished</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-sky-100/50 rounded-2xl p-6 border border-sky-200/50">
        <h3 className="font-semibold text-sky-900 mb-2">About This Quiz:</h3>
        <p className="text-sky-800/80">
          Test your knowledge about bullying awareness, intervention strategies, and creating safe communities with this interactive millionaire-style quiz. 
          Answer questions correctly to progress through the levels!
        </p>
      </div>
    </div>
  );
};

export default QuizModule;