import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, ChevronRight, X, Coffee } from 'lucide-react';

export default function ChaiMascotGreeting({ tableName = 'Table 01', cafeName = 'The 7 Cafe', onClose }) {
  const [closing, setClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  // Auto-dismiss countdown (4.5 seconds for pleasant reading)
  useEffect(() => {
    const totalDuration = 4500;
    const intervalTime = 50;
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          handleDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 350);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md transition-all duration-300 ${
        closing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0] rounded-3xl shadow-2xl border-2 border-[#EADCCB] p-5 text-center overflow-hidden transform transition-all duration-500 animate-smooth-fade"
      >
        {/* Decorative Floating Sparkles */}
        <div className="absolute top-4 left-5 animate-sparkle text-amber-500 pointer-events-none">
          <Sparkles className="w-5 h-5 fill-amber-400 opacity-80" />
        </div>
        <div className="absolute top-8 right-12 animate-sparkle text-amber-600 delay-500 pointer-events-none">
          <Sparkles className="w-4 h-4 fill-amber-300 opacity-90" />
        </div>
        <div className="absolute bottom-20 left-4 animate-sparkle text-rose-400 delay-700 pointer-events-none">
          <Heart className="w-4 h-4 fill-rose-400 text-rose-500 opacity-70" />
        </div>

        {/* Close / Skip Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[#EAD8C3]/70 hover:bg-[#DBC6AE] flex items-center justify-center text-[#5C3A21] transition-colors shadow-xs"
          title="Skip"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Table Detection Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold mb-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>📍 {tableName} Verified</span>
        </div>

        {/* Cartoon Illustration with Smooth Fade & Gentle Float Animation */}
        <div className="relative my-2 flex justify-center items-center">
          {/* Ambient Glow */}
          <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-amber-300/35 via-orange-300/25 to-rose-200/30 blur-2xl animate-pulse pointer-events-none" />

          {/* Image Container with smooth floating animation */}
          <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-xl border-4 border-white/90 bg-[#F4EDE4] animate-float-gentle group">
            <img
              src="/images/welcome-mascot.jpg"
              alt="Welcome to The 7 Cafe"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Subtle Overlay Badge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide border border-white/20 whitespace-nowrap shadow-md flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-amber-300" />
              <span>Coffee & Conversations ☕</span>
            </div>
          </div>
        </div>

        {/* Greeting Heading */}
        <h3 className="text-xl font-black text-[#2E1D11] tracking-tight mt-3 flex items-center justify-center gap-1.5">
          <span>☕</span>
          <span>Welcome to {cafeName || 'The 7 Cafe'}</span>
        </h3>

        {/* Subtitle / Description */}
        <p className="text-xs text-[#6B5A4D] mt-1.5 font-medium leading-relaxed px-2">
          ताजा गरमागरम कॉफी, चहा आणि चवदार खमंग नाश्ता! 
          आपल्या टेबलवरून थेट ऑर्डर करा.
        </p>

        {/* Progress Bar (Auto-forward indicator) */}
        <div className="w-full bg-[#EAD8C3] h-1.5 rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Call to action button */}
        <button
          onClick={handleDismiss}
          className="w-full mt-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#5C3A21] via-[#7A4B29] to-[#E58A3A] hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-[#5C3A21]/25 flex items-center justify-center gap-2 transform active:scale-95 transition-all animate-pulse-ring"
        >
          <span>मेनू पहा • Explore Menu</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
