import React, { useState, useEffect } from 'react';

export default function ChaiMascotGreeting({ cafeName = 'The 7 Cafe', onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Show for exactly 4 seconds as requested, then fade out
    const timer = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setClosing(true);
    // Smooth fade out duration
    setTimeout(() => {
      if (onClose) onClose();
    }, 450);
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#EBE1D8] px-6 select-none cursor-pointer overflow-hidden transition-opacity duration-500 ease-in-out ${
        closing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-sm flex flex-col items-center justify-center space-y-6 animate-smooth-fade">
        {/* Cartoon Image with Gentle Normal Shake / Wiggle Animation */}
        <div className="w-full aspect-square max-w-[330px] rounded-3xl overflow-hidden shadow-2xl border border-black/5 bg-[#EBE1D8] animate-gentle-shake">
          <img
            src="/images/welcome-mascot.jpg"
            alt={cafeName}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </div>

        {/* Unique Aesthetic Font for Cafe Name */}
        <div className="text-center pt-1">
          <h1 className="font-aesthetic-serif italic font-extrabold text-3xl sm:text-4xl text-[#2B1B10] tracking-wider drop-shadow-sm">
            {cafeName || 'The 7 Cafe'}
          </h1>
          <p className="font-aesthetic-cursive text-lg sm:text-xl text-[#75553E] font-semibold mt-1 tracking-wide">
            ~ coffee & conversations ~
          </p>
        </div>
      </div>
    </div>
  );
}
