import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import { buildApiUrl, API_ENDPOINTS } from '../../config/api';

interface ComicPage {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

interface ComicContent {
  type: string;
  title: string;
  pages: ComicPage[];
}

const ComicModule: React.FC = () => {
  const { completeModule } = useAppContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [comicContent, setComicContent] = useState<ComicContent | null>(null);

  useEffect(() => {
    // Fetch comic content from backend
    fetch(buildApiUrl(API_ENDPOINTS.MODULE.CONTENT(3)))
      .then(response => response.json())
      .then(data => setComicContent(data))
      .catch(error => console.error('Error fetching comic content:', error));
  }, []);

  const goToNextPage = () => {
    if (comicContent && currentPage < comicContent.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!comicContent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-sky-800">Loading comic content...</p>
        </div>
      </div>
    );
  }

  const currentComicPage = comicContent.pages[currentPage];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-sky-900 mb-2">{comicContent.title}</h2>
        <p className="text-sky-800/80">Follow this story about how understanding creates strong communities.</p>
      </header>

      <div className="bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden">
        <div className="bg-white/50 p-4 flex justify-between items-center">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className={`p-2 rounded-full transition-all duration-300 ${currentPage === 0 ? 'text-sky-300' : 'text-sky-600 hover:bg-sky-100'}`}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <h3 className="font-semibold text-sky-900">{currentComicPage.title}</h3>
            <p className="text-sm text-sky-700">Page {currentPage + 1} of {comicContent.pages.length}</p>
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === comicContent.pages.length - 1}
            className={`p-2 rounded-full transition-all duration-300 ${currentPage === comicContent.pages.length - 1 ? 'text-sky-300' : 'text-sky-600 hover:bg-sky-100'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="relative flex justify-center bg-gradient-to-br from-sky-50 to-teal-50 rounded-lg">
          <img 
            src={currentComicPage.image_url} 
            alt={currentComicPage.title}
            className="max-h-[600px] max-w-full object-contain"
            onError={(e) => {
              console.error('Error loading comic image:', currentComicPage.image_url);
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225"%3E%3Crect width="400" height="225" fill="%23e0f2fe"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="18" fill="%23075985"%3EComic Image Loading...%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <p className="text-lg">{currentComicPage.description}</p>
          </div>
        </div>

        <div className="p-4 bg-white/50">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {comicContent.pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentPage === index 
                      ? 'bg-gradient-to-r from-sky-500 to-teal-500' 
                      : 'bg-sky-200 hover:bg-sky-300'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            
            {currentPage === comicContent.pages.length - 1 && (
              <Button 
                onClick={() => completeModule(3)} 
                variant="primary"
                className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 transition-all duration-300"
                icon={<ArrowRight size={20} />}
              >
                Complete Journey
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-sky-100/50 rounded-2xl p-6 border border-sky-200/50">
        <h3 className="font-semibold text-sky-900 mb-2">Story Message:</h3>
        <p className="text-sky-800/80">
          This story shows how understanding and acceptance can transform a community. When we embrace our differences and support each other, we create a more peaceful and harmonious world.
        </p>
      </div>
    </div>
  );
};

export default ComicModule;