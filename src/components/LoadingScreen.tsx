'use client';

import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Quick loading timer
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete?.();
    }, 600); // Reduced from 2000ms to 600ms

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#272860] flex items-center justify-center">
      {/* Animated ORIZON Logo */}
      <div className="text-center">
        {/* Animated Minimalist Logo */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-orizon-secondary flex items-center justify-center animate-pulse hover:scale-110 transition-transform duration-500">
            <div className="w-14 h-14 bg-[#272860] flex flex-col justify-center items-center">
              <div className="w-10 h-1 bg-orizon-secondary mb-1 animate-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="w-10 h-1 bg-orizon-secondary mb-1 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-10 h-1 bg-orizon-secondary mb-1 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-10 h-1 bg-orizon-secondary animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Animated Text */}
        <div className="text-orizon-secondary text-3xl font-bold tracking-wider animate-fade-in">
          <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>O</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>R</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>I</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>Z</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>O</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>N</span>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
