import React, { useState, useEffect } from 'react';

export default function ChaiMascotGreeting({ cafeName = 'The 7 Cafe', onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Auto-advance after 2.8 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 650);
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#EBE1D8] px-6 transition-all duration-700 select-none cursor-pointer overflow-hidden ${
        closing ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="w-full max-w-sm flex flex-col items-center justify-center space-y-5 animate-smooth-fade">
        {/* Full Image */}
        <div className="w-full aspect-square max-w-[340px] rounded-3xl overflow-hidden shadow-2xl border border-black/5 bg-[#EBE1D8]">
          <img
            src="/images/welcome-mascot.jpg"
            alt={cafeName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Just Cafe Name */}
        <div className="text-center pt-1">
          <h1 className="text-3xl sm:text-4xl font-black text-[#2B1B10] tracking-tight">
            {cafeName || 'The 7 Cafe'}
          </h1>
        </div>
      </div>
    </div>
  );
}
