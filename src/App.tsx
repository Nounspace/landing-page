import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedGrid from './components/AnimatedGrid';
import Logo from './components/Logo';
import AnimatedTagline from './components/AnimatedTagline';
import WaitlistForm from './components/WaitlistForm';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleJoinWaitlist = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="relative">
      {/* Content Overlay */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <div className="h-full flex flex-col">
          {/* Header with Logo */}
          <header className="p-6 md:p-8 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Logo />
            </motion.div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center px-6 pointer-events-none">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              >
                <AnimatedTagline />
              </motion.div>

              <motion.div
                className="space-y-6 mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              >
                <button
                  onClick={handleJoinWaitlist}
                  className="group relative px-8 py-4 bg-black text-white font-semibold text-lg rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 border-2 border-gray-300 pointer-events-auto"
                >
                  <span className="relative z-10">Join Waitlist</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </button>

                <motion.p
                  className="text-gray-600 text-sm mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  Coming Fall 2025
                </motion.p>
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-10 pointer-events-auto">
        <AnimatedGrid />
      </div>

      {/* Waitlist Form Modal */}
      <WaitlistForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </div>
  );
}

export default App;