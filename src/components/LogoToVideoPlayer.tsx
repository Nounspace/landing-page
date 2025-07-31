import { useState, useEffect } from 'react';
import CurtainTransition from './CurtainTransition';
import logoImage from '/logo.png';
import logoVideo from '/logovid.mp4';

interface LogoToVideoPlayerProps {
  onVideoEnd?: () => void;
}

const LogoToVideoPlayer = ({ onVideoEnd }: LogoToVideoPlayerProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [fadeLogo, setFadeLogo] = useState(false);

  // Simplified auto-transition without refs
  useEffect(() => {
    if (!userInteracted) {
      const timer = setTimeout(() => {
        setShowVideo(true);
        // Start fading logo after video starts playing
        setTimeout(() => setFadeLogo(true), 100);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [userInteracted]);

  const handleLogoClick = () => {
    setUserInteracted(true);
    setShowVideo(true);
    // Start fading logo after video starts playing
    setTimeout(() => setFadeLogo(true), 100);
  };

  const handleVideoClick = () => {
    // Simple click handling without preventDefault
    setUserInteracted(true);
  };

  const handleVideoEnded = () => {
    setIsDissolving(true);
    onVideoEnd?.();
  };



  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${!isDissolving ? 'bg-white' : ''} ${isDissolving ? 'pointer-events-none' : ''}`}
      style={{ transform: 'translateY(-15vh)' }}
    >
      <CurtainTransition 
        isActive={isDissolving}
        onComplete={() => {
          // Optional: handle completion if needed
        }}
      />

      {!isDissolving && (
        <div className="w-full lg:w-2/5 h-auto max-h-full relative">
          {/* Video Player - loads behind logo */}
          {showVideo && (
            <div 
              className="relative w-full h-full cursor-pointer"
              onClick={handleVideoClick}
            >
              <video
                className="w-full h-auto object-contain"
                onEnded={handleVideoEnded}
                playsInline
                autoPlay
                muted
                preload="metadata"
              >
                <source src={logoVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Logo Image - overlays video and fades out */}
          <div 
            className={`w-full h-full flex items-center justify-center absolute inset-0 transition-opacity duration-500 ease-out ${
              showVideo ? 'pointer-events-none' : 'cursor-pointer'
            } ${fadeLogo ? 'opacity-0' : 'opacity-100'}`}
            onClick={!showVideo ? handleLogoClick : undefined}
          >
            <img
              src={logoImage}
              alt="Brand Logo"
              className="w-[35.5%] z-50 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoToVideoPlayer;