import React, { useState, useEffect } from 'react';

interface CurtainTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
}

const CurtainTransition = ({ isActive, onComplete }: CurtainTransitionProps) => {
  const [curtainPosition, setCurtainPosition] = useState(0);
  const [hideContent, setHideContent] = useState(false);

  useEffect(() => {
    // Animate curtain split when transition becomes active
    if (isActive) {
      setHideContent(true);
      
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
        } else {
          // Animation complete
          onComplete?.();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isActive, onComplete]);

  if (!isActive) {
    return null;
  }

  const featherSize = 50; // Size of the feathered edge
  const curtainWidth = Math.max(0, window.innerWidth / 2 - curtainPosition);
  const curtainHeight = Math.max(0, window.innerHeight / 2 - curtainPosition);

  return (
    <>
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
    </>
  );
};

export default CurtainTransition;