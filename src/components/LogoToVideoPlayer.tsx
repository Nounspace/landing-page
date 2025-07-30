import React, { useRef, useState, useEffect } from 'react';

interface LogoToVideoPlayerProps {
  onVideoEnd?: () => void;
}

const LogoToVideoPlayer = ({ onVideoEnd }: LogoToVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasUserClicked, setHasUserClicked] = useState(false);
  const [curtainPosition, setCurtainPosition] = useState(0);
  const [isDissolving, setIsDissolving] = useState(false);
  const [hideContent, setHideContent] = useState(false);

  useEffect(() => {
    // Once video is loaded, wait 3 seconds then autoplay (unless user already clicked)
    if (videoLoaded && !isPlaying && !hasUserClicked) {
      const autoplayTimer = setTimeout(() => {
        if (videoRef.current && !hasUserClicked) {
          videoRef.current.play();
        }
      }, 3000);

      return () => clearTimeout(autoplayTimer);
    }
  }, [videoLoaded, isPlaying, hasUserClicked]);

  useEffect(() => {
    // Animate curtain split after video ends
    if (isDissolving) {
      const animationDuration = 1500; // 1.5 seconds for curtain effect
      
      // Calculate max position (half screen width/height plus feather size)
      const featherSize = 50;
      const maxPosition = Math.min(window.innerWidth / 2 + featherSize, window.innerHeight / 2 + featherSize);
      
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const newPosition = progress * maxPosition;
        setCurtainPosition(newPosition);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
        // Removed the automatic hiding - curtains stay visible
      };
      
      requestAnimationFrame(animate);
    }
  }, [isDissolving]);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setHasUserClicked(true);
    togglePlay();
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setHideContent(true);
    setIsDissolving(true);
    onVideoEnd?.();
  };

  if (!isVisible) {
    return null;
  }

  const featherSize = 50; // Size of the feathered edge
  const curtainWidth = Math.max(0, window.innerWidth / 2 - curtainPosition);
  const curtainHeight = Math.max(0, window.innerHeight / 2 - curtainPosition);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${!videoLoaded ? 'bg-white' : ''} ${isDissolving ? 'pointer-events-none' : ''}`}>
      {/* Left curtain */}
      <div 
        className="absolute top-0 left-0 h-full"
        style={{
          width: `${curtainWidth}px`,
          background: `linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) ${curtainWidth - featherSize}px, rgba(255, 255, 255, 0.8) ${curtainWidth - featherSize/2}px, rgba(255, 255, 255, 0) ${curtainWidth}px)`,
          transition: 'width 0.1s ease-out'
        }}
      />
      
      {/* Right curtain */}
      <div 
        className="absolute top-0 right-0 h-full"
        style={{
          width: `${curtainWidth}px`,
          background: `linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) ${curtainWidth - featherSize}px, rgba(255, 255, 255, 0.8) ${curtainWidth - featherSize/2}px, rgba(255, 255, 255, 0) ${curtainWidth}px)`,
          transition: 'width 0.1s ease-out'
        }}
      />

      {/* Top curtain */}
      <div 
        className="absolute top-0 left-0 w-full"
        style={{
          height: `${curtainHeight}px`,
          background: `linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) ${curtainHeight - featherSize}px, rgba(255, 255, 255, 0.8) ${curtainHeight - featherSize/2}px, rgba(255, 255, 255, 0) ${curtainHeight}px)`,
          transition: 'height 0.1s ease-out'
        }}
      />
      
      {/* Bottom curtain */}
      <div 
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: `${curtainHeight}px`,
          background: `linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) ${curtainHeight - featherSize}px, rgba(255, 255, 255, 0.8) ${curtainHeight - featherSize/2}px, rgba(255, 255, 255, 0) ${curtainHeight}px)`,
          transition: 'height 0.1s ease-out'
        }}
      />

      {!hideContent && (
        <div className="relative w-full lg:w-2/5 h-auto max-h-full">
          {/* Brand Logo Image - shows first while video loads */}
          {!videoLoaded && (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Brand Logo"
                className="w-[30%] h-auto object-contain"
              />
            </div>
          )}

          {/* Video Player - appears once loaded */}
          <div 
            className={`${videoLoaded ? 'block' : 'hidden'} relative w-full h-full cursor-pointer`}
            onClick={handleVideoClick}
          >
            <video
              ref={videoRef}
              className="w-full h-auto object-contain"
              onLoadedData={handleVideoLoaded}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleVideoEnd}
              playsInline
              preload="auto"
              muted
            >
              <source src="/logovid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoToVideoPlayer;