import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, Pause } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

interface VideoContent {
  type: string;
  title: string;
  description: string;
  video_url: string;
  filename: string;
}

const AnimationModule: React.FC = () => {
  const { completeModule } = useAppContext();
  const [videoContent, setVideoContent] = useState<VideoContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Fetch video content from backend
    fetch('/api/module/1/content')
      .then(response => response.json())
      .then(data => setVideoContent(data))
      .catch(error => console.error('Error fetching video content:', error));
  }, []);

  const handlePlay = () => {
    if (videoRef) {
      videoRef.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef) {
      videoRef.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setVideoWatched(true);
  };

  const handleVideoRef = (element: HTMLVideoElement | null) => {
    setVideoRef(element);
    if (element) {
      element.addEventListener('ended', handleVideoEnd);
      element.addEventListener('play', () => setIsPlaying(true));
      element.addEventListener('pause', () => setIsPlaying(false));
    }
  };

  if (!videoContent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-sky-800">Loading video content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-sky-900 mb-2">{videoContent.title}</h2>
        <p className="text-sky-800/80">{videoContent.description}</p>
      </header>

      <div className="bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden">
        <div className="relative aspect-video bg-gradient-to-br from-sky-100 to-teal-100">
          <video
            ref={handleVideoRef}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23e0f2fe'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='18' fill='%23075985'%3EEducational Video%3C/text%3E%3C/svg%3E"
          >
            <source src={videoContent.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button
                onClick={handlePlay}
                className="w-20 h-20 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center text-white transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl"
              >
                <Play size={36} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => completeModule(1)} 
          variant="primary"
          className={`bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 transition-all duration-300 ${
            !videoWatched ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!videoWatched}
          icon={<ArrowRight size={20} />}
        >
          {videoWatched ? 'Continue Journey' : 'Watch video to continue'}
        </Button>
      </div>

      <div className="bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 p-6">
        <h3 className="font-semibold text-sky-900 mb-3">What You'll Learn:</h3>
        <ul className="list-disc list-inside space-y-2 text-sky-800/80">
          <li>Understanding different perspectives</li>
          <li>Building empathy and compassion</li>
          <li>Steps to promote harmony</li>
          <li>Ways to support and uplift others</li>
        </ul>
      </div>

      <div className="bg-sky-100/50 rounded-2xl p-6 border border-sky-200/50">
        <h3 className="font-semibold text-sky-900 mb-2">Key Takeaways:</h3>
        <p className="text-sky-800/80">
          Everyone deserves to feel safe and respected. By understanding each other better, we can create a more peaceful and supportive environment for all.
        </p>
      </div>
    </div>
  );
};

export default AnimationModule;