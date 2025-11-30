import React from 'react';

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="text-center space-y-6 px-6">
        <h1 className="text-6xl md:text-8xl font-light text-white tracking-tight">
          Reborn In Japan
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
          Discover your path to wellness through personalized journeys across Japan
        </p>
      </div>
    </div>
  );
}
