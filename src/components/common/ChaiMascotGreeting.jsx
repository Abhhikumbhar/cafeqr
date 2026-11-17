import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function ChaiMascotGreeting({ cafeName = 'The 7 Cafe', onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Show for 4 seconds, then smoothly fade into menu
    const timer = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setClosing(true);
    // Smooth cinematic fade out duration
    setTimeout(() => {
      if (onClose) onClose();
    }, 550);
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#EBE1D8] px-6 select-none cursor-pointer overflow-hidden transition-all duration-700 ease-in-out ${
        closing ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-6 animate-smooth-fade">
        {/* Soft Romantic Ambient Glow */}
        <div className="absolute top-1/3 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-rose-300/35 via-amber-200/30 to-orange-200/25 blur-3xl pointer-events-none animate-romantic-glow" />

        {/* Floating Romantic Hearts */}
        <div className="absolute -top-3 right-8 pointer-events-none animate-float-heart-1">
          <Heart className="w-5 h-5 fill-rose-400 text-rose-400 drop-shadow-md opacity-85" />
        </div>
        <div className="absolute top-14 left-6 pointer-events-none animate-float-heart-2">
          <Heart className="w-4 h-4 fill-pink-400 text-pink-400 drop-shadow-sm opacity-80" />
        </div>
        <div className="absolute top-1/2 -right-2 pointer-events-none animate-float-heart-2">
          <Sparkles className="w-4 h-4 fill-amber-300 text-amber-400 drop-shadow-sm opacity-90" />
        </div>

        {/* Couple Image with Ultra-Smooth Gentle Floating Breathing Animation (No Shake) */}
        <div className="relative z-10 w-full aspect-square max-w-[330px] rounded-3xl overflow-hidden shadow-2xl border border-black/5 bg-[#EBE1D8] animate-couple-float">
          <img
            src="/images/welcome-mascot.jpg"
            alt={cafeName}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </div>

        {/* Romantic Aesthetic Typography */}
        <div className="relative z-10 text-center pt-1 space-y-1">
          <h1 className="font-aesthetic-serif italic font-extrabold text-3xl sm:text-4xl text-[#2B1B10] tracking-wider drop-shadow-xs">
            {cafeName || 'The 7 Cafe'}
          </h1>
          <p className="font-aesthetic-cursive text-lg sm:text-xl text-[#75553E] font-bold tracking-wide">
            ~ coffee & conversations ~
          </p>
        </div>
      </div>
    </div>
  );
}
