import React from 'react';
import { FaHeartbeat, FaStethoscope, FaUserMd, FaPlus } from 'react-icons/fa';

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="relative">
        {/* Animated heartbeat icon */}
        <div className="flex items-center justify-center">
          <FaHeartbeat className="h-16 w-16 text-red-500 animate-pulse" />
          <div className="absolute -top-2 -right-2">
            <div className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></div>
          </div>
        </div>
        
        {/* Animated stethoscope */}
        <div className="mt-8 flex justify-center">
          <div className="relative">
            <FaStethoscope className="h-12 w-12 text-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute -bottom-2 -right-2">
              <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></div>
            </div>
          </div>
        </div>
        
        {/* Animated doctor icon */}
        <div className="mt-8 flex justify-center">
          <div className="relative">
            <FaUserMd className="h-12 w-12 text-green-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
            <div className="absolute -bottom-2 -right-2">
              <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading text with animation */}
      <div className="mt-10 flex items-center">
        <span className="text-lg font-medium text-gray-700">Loading</span>
        <div className="flex ml-2">
          <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce mx-0.5" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce mx-0.5" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce mx-0.5" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
      
      {/* Medical-themed progress indicator */}
      <div className="mt-6 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 animate-progress"></div>
      </div>
      
      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;