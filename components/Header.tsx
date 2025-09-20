
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-5 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          AI Storyboard Generator
        </h1>
        <p className="mt-2 text-gray-400">Bring your stories to life, one frame at a time.</p>
      </div>
    </header>
  );
};

export default Header;
