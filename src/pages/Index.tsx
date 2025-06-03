
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-slate-800 tracking-tight">
            Your Project
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            A clean slate ready for your ideas
          </p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-lg">
          <p className="text-slate-500 text-lg">
            Start building something amazing
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
