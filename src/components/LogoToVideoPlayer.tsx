import React, { useRef, useState, useEffect } from 'react';

interface LogoToVideoPlayerProps {
  onVideoEnd?: () => void;
}

const LogoToVideoPlayer = ({ onVideoEnd }: LogoToVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserClicked, setHasUserClicked] = useState(false);
  const [curtainPosition, setCurtainPosition] = useState(0);
  const [isDissolving, setIsDissolving] = useState(false);
  const [hideContent, setHideContent] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    // Once video is loaded, wait 3 seconds then show video and autoplay
    if (videoLoaded && !isPlaying && !hasUserClicked) {
      const autoplayTimer = setTimeout(() => {
        if (videoRef.current && !hasUserClicked) {
          // Hide the logo image and show video
          setShowLogo(false);
          // Start playing immediately
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
      const maxPosition = Math.max(window.innerWidth / 2 + featherSize, window.innerHeight / 2 + featherSize);
      
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

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (videoRef.current) {
      videoRef.current.play();
    }
    setHasUserClicked(true);
  };

  const handleLogoClick = () => {
    // When logo is clicked, hide logo and play video
    if (videoRef.current && videoLoaded) {
      setShowLogo(false);
      setHasUserClicked(true);
      videoRef.current.play();
    } else {
      // If video isn't loaded yet, fallback to immediate curtain effect
      setHideContent(true);
      setIsDissolving(true);
      onVideoEnd?.();
    }
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

  const featherSize = 50; // Size of the feathered edge
  const curtainWidth = Math.max(0, window.innerWidth / 2 - curtainPosition);
  const curtainHeight = Math.max(0, window.innerHeight / 2 - curtainPosition);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${!videoLoaded ? 'bg-white' : ''} ${isDissolving ? 'pointer-events-none' : ''}`}
      onClick={showLogo ? handleLogoClick : undefined}
      style={{ cursor: showLogo ? 'pointer' : 'default' }}
    >
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
        <div className="w-full lg:w-2/5 h-auto max-h-full">
          {/* Logo Image - shows while video is loading */}
          {showLogo && (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Brand Logo"
                className="w-[35.5%] z-50 object-contain"
              />
            </div>
          )}
                      {/* Video Player - shows only when ready */}
            <div 
              className="relative w-full h-full cursor-pointer"
              onClick={handleVideoClick}
              style={{
                display: showLogo ? 'none' : 'block'
              }}
            >
            <video
              ref={videoRef}
              className="w-full h-auto object-contain"
              onLoadedData={handleVideoLoaded}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleVideoEnd}
              playsInline={true}
              autoPlay={true}
              preload="auto"
              muted={true}
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