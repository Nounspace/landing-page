import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedGrid from './components/AnimatedGrid';
import Logo from './components/Logo';
import AnimatedTagline from './components/AnimatedTagline';
import WaitlistForm from './components/WaitlistForm';
import LogoToVideoPlayer from './components/LogoToVideoPlayer';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);

  const handleJoinWaitlist = () => {
    setIsFormOpen(true);
  };

  const handleVideoEnd = () => {
    setVideoFinished(true);
  };

  return (
    <div className="relative bg-white min-h-screen font-primary">
      {/* Logo to Video Player - Shows over everything */}
      <LogoToVideoPlayer onVideoEnd={handleVideoEnd} />

      {/* Content Overlay */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <div className="h-full flex flex-col">
          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center px-6 pointer-events-none">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={videoFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              >
                <AnimatedTagline />
              </motion.div>

              <motion.div
                className="space-y-6 mt-24"
                initial={{ opacity: 0, y: 30 }}
                animate={videoFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              >
                <button
                  onClick={handleJoinWaitlist}
                  className="z-10 group relative px-8 py-4 bg-black text-white font-semibold text-lg rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 border-2 border-gray-300 pointer-events-auto font-primary"
                >
                  <span className="relative z-10">Join Waitlist</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </button>

                <motion.div
                  className="mt-4 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={videoFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                >
                  <div className="inline-block bg-white px-4 py-2" style={{ boxShadow: 'inset 2px 2px 15px rgba(255,255,255,0.5)' }}>
                    <span className="text-gray-800 font-medium text-sm opacity-70 font-secondary">Coming Fall 2025</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Animated Grid Background */}
      <AnimatedGrid />

      {/* Waitlist Form Modal */}
      <WaitlistForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </div>
  );
}

export default App;