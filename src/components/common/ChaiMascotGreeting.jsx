import React, { useState, useEffect } from 'react';
import { Sparkles, Utensils, Heart, ChevronRight, X, Coffee } from 'lucide-react';

export default function ChaiMascotGreeting({ tableName = 'Table 01', onClose }) {
  const [closing, setClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  // Auto-dismiss countdown (4 seconds)
  useEffect(() => {
    const totalDuration = 4000;
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-[#FFFDF9] via-[#FAF4EB] to-[#F3E8D8] rounded-3xl shadow-2xl border-2 border-[#E8D7C3] p-6 text-center overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95"
      >
        {/* Decorative Floating Sparkles */}
        <div className="absolute top-4 left-6 animate-sparkle text-amber-500">
          <Sparkles className="w-5 h-5 fill-amber-400 opacity-80" />
        </div>
        <div className="absolute top-10 right-8 animate-sparkle text-amber-600 delay-500">
          <Sparkles className="w-4 h-4 fill-amber-300 opacity-90" />
        </div>
        <div className="absolute bottom-16 left-6 animate-sparkle text-orange-400 delay-700">
          <Heart className="w-4 h-4 fill-red-400 text-red-500 opacity-70" />
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#EAD8C3]/60 hover:bg-[#EAD8C3] flex items-center justify-center text-[#5C3A21] transition-colors"
          title="Skip"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Table Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold mb-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>📍 {tableName} Detected</span>
        </div>

        {/* Cartoon Character: Chai Babu / Chhotu Chaiwala */}
        <div className="relative my-2 flex justify-center items-center">
          {/* Glowing Aura */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-amber-300/40 via-orange-300/30 to-yellow-200/40 blur-xl animate-pulse" />

          {/* Animated SVG Cartoon Mascot */}
          <div className="relative animate-mascot-bob">
            <svg
              viewBox="0 0 200 220"
              className="w-44 h-44 drop-shadow-xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Steams rising */}
              <g className="animate-steam-1" opacity="0.6">
                <path
                  d="M85 45 C80 30, 95 20, 88 10"
                  stroke="#C68B59"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>
              <g className="animate-steam-2" opacity="0.8">
                <path
                  d="M102 42 C108 26, 96 16, 104 6"
                  stroke="#C68B59"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
              <g className="animate-steam-3" opacity="0.6">
                <path
                  d="M118 46 C124 32, 112 22, 120 12"
                  stroke="#C68B59"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>

              {/* Chef Hat / Topi */}
              <g id="chef-hat">
                <path
                  d="M75 58 C72 40, 85 34, 100 34 C115 34, 128 40, 125 58 Z"
                  fill="#FFFFFF"
                  stroke="#D3C1AE"
                  strokeWidth="2.5"
                />
                <circle cx="82" cy="42" r="10" fill="#FFFFFF" />
                <circle cx="100" cy="38" r="12" fill="#FFFFFF" />
                <circle cx="118" cy="42" r="10" fill="#FFFFFF" />
                {/* Red Tilak / Golden band */}
                <path
                  d="M74 56 C82 54, 118 54, 126 56"
                  stroke="#E58A3A"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="49" r="2.5" fill="#DC2626" />
              </g>

              {/* Cup Saucer / Glass Stand */}
              <ellipse cx="100" cy="186" rx="55" ry="12" fill="#D4BBA5" />
              <ellipse cx="100" cy="184" rx="50" ry="10" fill="#EADCCF" stroke="#BFA38C" strokeWidth="2" />

              {/* Chai Cup / Glass Body */}
              <path
                d="M62 70 L72 175 C73 180, 127 180, 128 175 L138 70 Z"
                fill="url(#chai-gradient)"
                stroke="#6B3F20"
                strokeWidth="4"
              />

              {/* Glass Rim Highlight */}
              <ellipse cx="100" cy="70" rx="38" ry="10" fill="#F4A261" stroke="#6B3F20" strokeWidth="3" />
              <ellipse cx="100" cy="69" rx="34" ry="7" fill="#8C4A1F" />

              {/* Cartoon Face */}
              {/* Eyes */}
              <g className="animate-blink">
                {/* Left Eye */}
                <ellipse cx="86" cy="112" rx="7" ry="9" fill="#241A14" />
                <circle cx="88" cy="109" r="3" fill="#FFFFFF" />
                <circle cx="84" cy="115" r="1.5" fill="#FFFFFF" />

                {/* Right Eye */}
                <ellipse cx="114" cy="112" rx="7" ry="9" fill="#241A14" />
                <circle cx="116" cy="109" r="3" fill="#FFFFFF" />
                <circle cx="112" cy="115" r="1.5" fill="#FFFFFF" />
              </g>

              {/* Eyebrows (Cheerful) */}
              <path d="M80 99 Q86 94 92 98" stroke="#3D2314" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M108 98 Q114 94 120 99" stroke="#3D2314" strokeWidth="2.5" strokeLinecap="round" />

              {/* Rosy Cheeks */}
              <circle cx="76" cy="124" r="7" fill="#FF8A8A" opacity="0.6" />
              <circle cx="124" cy="124" r="7" fill="#FF8A8A" opacity="0.6" />

              {/* Happy Big Smile with tongue */}
              <path
                d="M89 126 Q100 142 111 126"
                stroke="#3D2314"
                strokeWidth="3"
                fill="#DC2626"
                strokeLinecap="round"
              />
              <path
                d="M94 133 Q100 138 106 133"
                fill="#FF8080"
              />

              {/* Left Hand: Resting gracefully or holding kettle */}
              <g id="left-arm">
                <path
                  d="M65 115 Q46 128 54 148"
                  stroke="#5C3A21"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* White Glove */}
                <circle cx="56" cy="150" r="8" fill="#FFFFFF" stroke="#6B3F20" strokeWidth="2" />
                <circle cx="53" cy="146" r="3" fill="#FFFFFF" />
              </g>

              {/* Right Hand: Waving enthusiastically! */}
              <g id="right-arm" className="animate-mascot-wave">
                <path
                  d="M135 115 Q158 95 168 85"
                  stroke="#5C3A21"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* White Glove Waving with friendly fingers */}
                <g transform="translate(168, 75)">
                  <circle cx="6" cy="10" r="8" fill="#FFFFFF" stroke="#6B3F20" strokeWidth="2" />
                  <path d="M4 3 C4 0, 8 0, 8 4 L8 9" stroke="#6B3F20" strokeWidth="2" fill="#FFFFFF" />
                  <path d="M9 3 C9 -1, 13 -1, 13 4 L13 10" stroke="#6B3F20" strokeWidth="2" fill="#FFFFFF" />
                  <path d="M14 5 C14 2, 17 2, 17 7 L17 11" stroke="#6B3F20" strokeWidth="2" fill="#FFFFFF" />
                  {/* Motion wave lines */}
                  <path d="M22 2 C25 6, 25 12, 22 16" stroke="#E58A3A" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M26 -1 C30 5, 30 15, 26 20" stroke="#E58A3A" strokeWidth="2" strokeLinecap="round" fill="none" />
                </g>
              </g>

              {/* Tea Droplet/Star Sparkles near Cup */}
              <circle cx="70" cy="85" r="2.5" fill="#FFE58F" />
              <circle cx="128" cy="88" r="2.5" fill="#FFE58F" />

              {/* Gradients */}
              <defs>
                <linearGradient id="chai-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D9822B" />
                  <stop offset="40%" stopColor="#B25917" />
                  <stop offset="100%" stopColor="#69300D" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Greeting Heading */}
        <h3 className="text-xl font-black text-[#3D2314] tracking-tight mt-1 flex items-center justify-center gap-1.5">
          <span>🙏</span>
          <span>नमस्ते! Welcome</span>
        </h3>

        {/* Cafe Name */}
        <p className="text-base font-bold text-[#A45214]">
          साईराम चहावाला
        </p>

        {/* Friendly Marathi & English Welcome Message */}
        <p className="text-xs text-[#6B5A4D] mt-2 font-medium leading-relaxed px-1">
          गरमागरम स्पेशल कडक चहा आणि स्वादिष्ट खमंग नाश्ता आपल्या सेवेसाठी तयार आहे! 
          आपल्या मोबाईलवरून आवडीचे पदार्थ निवडा आणि थेट ऑर्डर द्या.
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
          className="w-full mt-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#D97724] to-[#B85714] hover:from-[#C96B1C] hover:to-[#A34B0E] text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transform active:scale-95 transition-all animate-pulse-ring"
        >
          <span>मेनू पहा • Explore Menu</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
