import React from 'react';
import { Home } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg border border-gray-300">
        <Home className="w-5 h-5 text-white" />
      </div>
      <span className="text-black font-bold text-xl tracking-wide">Community</span>
    </div>
  );
};

export default Logo;