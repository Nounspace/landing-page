import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const AnimatedTagline: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('space');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const dropdownOptions = ['space', 'token', 'agent'];
  
  const dropdownGradients = {
    space: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600',
    token: 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500',
    agent: 'bg-gradient-to-r from-orange-500 via-red-500 to-rose-500'
  };
  
  const typewriterExamples = [
    'community',
    'brand',
    'Farcaster Channel',
    'DAO',
    'school',
    'city',
    'Network State',
    'fans',
    'sports team',
    'book club',
    'cult'
  ];

  const gradientClasses = [
    'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500', // community
    'bg-gradient-to-r from-purple-600 via-pink-500 to-red-500', // brand
    'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500', // Farcaster Channel
    'bg-gradient-to-r from-emerald-500 via-green-400 to-lime-400', // DAO
    'bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500', // school
    'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400', // city
    'bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500', // Network State
    'bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600', // fans
    'bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400', // sports team
    'bg-gradient-to-r from-amber-600 via-yellow-500 to-lime-500', // book club
    'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600' // cult
  ];

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter animation effect
  useEffect(() => {
    const currentExample = typewriterExamples[currentIndex];
    
    if (isTyping) {
      if (currentText.length < currentExample.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentExample.slice(0, currentText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause then start deleting
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, move to next example
        const timeout = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % typewriterExamples.length);
          setIsTyping(true);
        }, 200);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentText, currentIndex, isTyping]);

  const handleDropdownSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-8 leading-tight">
        Create a{' '}
        <div className="relative inline-block">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`${dropdownGradients[selectedOption as keyof typeof dropdownGradients]} bg-clip-text text-transparent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 rounded-lg px-2 py-2 pb-3 inline-flex items-center gap-2 pointer-events-auto hover:opacity-80`}
          >
            {selectedOption}
            <ChevronDown 
              className={`w-6 h-6 md:w-8 md:h-8 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              style={{
                color: selectedOption === 'space' ? '#9333ea' : 
                       selectedOption === 'token' ? '#059669' : '#ea580c'
              }}
            />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-30 min-w-full pointer-events-auto">
              {dropdownOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleDropdownSelect(option)}
                  className={`block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg text-2xl md:text-4xl lg:text-5xl font-bold ${dropdownGradients[option as keyof typeof dropdownGradients]} bg-clip-text text-transparent`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        {' '}for my
        <br />
        <span className="relative inline-block">
          <span className={`border-b-4 ${gradientClasses[currentIndex]} bg-clip-text text-transparent`}>
            {currentText}
            <span 
              className={`inline-block w-1 h-12 md:h-16 lg:h-20 bg-black ml-1 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-100`}
              style={{ verticalAlign: 'text-bottom' }}
            />
          </span>
          {/* Invisible text to maintain consistent width */}
          <span 
            className="absolute top-0 left-0 opacity-0 pointer-events-none select-none"
            aria-hidden="true"
          >
            Network State
          </span>
        </span>
      </h1>
    </div>
  );
};

export default AnimatedTagline;