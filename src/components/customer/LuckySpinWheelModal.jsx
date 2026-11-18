import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Gift,
  X,
  Phone,
  CheckCircle2,
  Trophy,
  Coffee,
  RotateCw,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

// Available Slices on the Lucky Wheel
export const SPIN_PRIZES = [
  {
    id: 'chai',
    label: 'Free Kadak Chai',
    icon: '☕',
    code: 'SPIN-CHAI',
    discount: 40,
    minBill: 80,
    description: 'Free Special Kadak Chai on bill above ₹80',
    color: '#D97706', // Amber-600
    textColor: '#FFFFFF',
    isWin: true
  },
  {
    id: 'fries',
    label: 'Free French Fries',
    icon: '🍟',
    code: 'SPIN-FRIES',
    discount: 90,
    minBill: 200,
    description: 'Free Peri-Peri Fries on bill above ₹200',
    color: '#5C3A21', // Dark Espresso
    textColor: '#FDE68A',
    isWin: true
  },
  {
    id: 'discount15',
    label: '15% Flat Discount',
    icon: '🎟️',
    code: 'SPIN-15',
    discountPercent: 15,
    maxDiscount: 75,
    minBill: 150,
    description: '15% OFF (up to ₹75) on bill above ₹150',
    color: '#059669', // Emerald-600
    textColor: '#FFFFFF',
    isWin: true
  },
  {
    id: 'cookie',
    label: 'Free Choco Brownie',
    icon: '🍫',
    code: 'SPIN-BROWNIE',
    discount: 80,
    minBill: 200,
    description: 'Free Choco Walnut Brownie on bill above ₹200',
    color: '#854D0E', // Brown-700
    textColor: '#FFFFFF',
    isWin: true
  },
  {
    id: 'cash50',
    label: 'Flat ₹50 OFF',
    icon: '🪙',
    code: 'SPIN-50',
    discount: 50,
    minBill: 250,
    description: '₹50 flat discount on orders above ₹250',
    color: '#DC2626', // Red-600
    textColor: '#FFFFFF',
    isWin: true
  },
  {
    id: 'luck',
    label: 'Better Luck Next Time',
    icon: '🍀',
    code: null,
    discount: 0,
    description: 'Thank you for playing! Try again on your next order.',
    color: '#4B5563', // Slate-600
    textColor: '#F3F4F6',
    isWin: false
  }
];

export default function LuckySpinWheelModal({
  isOpen,
  onClose,
  onApplyPrize,
  customerPhone = '',
  setCustomerPhone,
  triggerConfetti,
  addToast
}) {
  const [phoneInput, setPhoneInput] = useState(customerPhone || '');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const numSlices = SPIN_PRIZES.length;
  const sliceAngle = 360 / numSlices;

  // Check if this phone number already spun today
  useEffect(() => {
    if (customerPhone) {
      setPhoneInput(customerPhone);
      checkSpunStatus(customerPhone);
    }
  }, [customerPhone]);

  const checkSpunStatus = (phone) => {
    if (!phone || phone.length < 10) return;
    try {
      const today = new Date().toDateString();
      const savedKey = `the7cafe_spin_${phone.trim()}`;
      const savedData = localStorage.getItem(savedKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.date === today) {
          setHasSpunToday(true);
          setWonPrize(parsed.prize);
          return;
        }
      }
      setHasSpunToday(false);
    } catch {
      setHasSpunToday(false);
    }
  };

  // Play synthetic mechanical click tick sound using Web Audio API
  const playTickSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Play synthetic victory chime
  const playVictorySound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
      });
    } catch {}
  };

  const handleStartSpin = () => {
    const cleanPhone = phoneInput.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter your 10-digit mobile number to spin!');
      return;
    }
    setErrorMsg('');

    if (hasSpunToday && wonPrize) {
      addToast('You have already used your daily spin today! Enjoy your prize.', 'info');
      return;
    }

    if (setCustomerPhone) {
      setCustomerPhone(cleanPhone);
    }

    setIsSpinning(true);
    setWonPrize(null);

    // Weighted winning algorithm (biased towards attractive discounts: 15%, Chai, Fries, ₹50)
    // 90% chance of winning a cafe perk to drive delight!
    const winIndexes = [0, 1, 2, 3, 4];
    const randomIndex = Math.random() < 0.15
      ? 5 // 15% chance of "Better Luck Next Time"
      : winIndexes[Math.floor(Math.random() * winIndexes.length)];

    const selectedPrize = SPIN_PRIZES[randomIndex];

    // Calculate rotation:
    // Pointer is located at the top (0 degrees).
    // The slice at index i spans [i * sliceAngle, (i + 1) * sliceAngle].
    // Center of slice i is (i + 0.5) * sliceAngle.
    // To land under top pointer, the wheel needs to rotate such that:
    // targetAngle % 360 = 360 - centerOfSlice
    const centerOfSlice = (randomIndex + 0.5) * sliceAngle;
    const extraRounds = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    const targetRotation = rotationAngle + (extraRounds * 360) + (360 - centerOfSlice) - (rotationAngle % 360);

    // Play periodic ticking
    const tickInterval = setInterval(() => {
      playTickSound();
    }, 180);

    setRotationAngle(targetRotation);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      setHasSpunToday(true);

      // Save to localStorage for daily limit
      const today = new Date().toDateString();
      localStorage.setItem(
        `the7cafe_spin_${cleanPhone}`,
        JSON.stringify({ date: today, prize: selectedPrize })
      );

      if (selectedPrize.isWin) {
        playVictorySound();
        if (triggerConfetti) triggerConfetti();
        if (addToast) {
          addToast(`Congratulations! You won ${selectedPrize.label}!`, 'success');
        }
      } else {
        if (addToast) {
          addToast('Better luck next time! Thanks for spinning!', 'info');
        }
      }
    }, 4500); // 4.5s smooth deceleration
  };

  const handleApplyToCart = () => {
    if (wonPrize?.code && onApplyPrize) {
      onApplyPrize(wonPrize);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#241A14]/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-[#FFFDF9] via-white to-[#FDF8F0] rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border-2 border-[#EADCCB] relative overflow-hidden text-center">
        {/* Decorative background flare */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#E58A3A]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSpinning}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF5EE] hover:bg-[#EAE1D3] text-[#665A4F] flex items-center justify-center font-bold text-sm transition-all disabled:opacity-30"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#5C3A21] text-[10px] font-black uppercase tracking-wider border border-amber-300 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#E58A3A] animate-spin" />
            The 7 Cafe Daily Treats
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#241A14] mt-1.5 tracking-tight">
            Lucky Spin & Win
          </h3>
          <p className="text-xs text-[#8A7A6E]">
            Spin the wheel once per visit to unlock free food, drinks, and secret coupons!
          </p>
        </div>

        {/* The Wheel Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-3 flex items-center justify-center">
          {/* Outer Gold Ring with Bulbs */}
          <div className="absolute inset-0 rounded-full border-8 border-[#3B281B] shadow-2xl bg-[#241A14] flex items-center justify-center">
            {/* LED Bulb dots */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  transform: `rotate(${i * 30}deg) translate(0, -122px)`
                }}
                className={`absolute w-2.5 h-2.5 rounded-full ${
                  isSpinning
                    ? i % 2 === 0 ? 'bg-amber-300 shadow-amber-300 shadow-sm' : 'bg-white'
                    : 'bg-amber-300 shadow-amber-400 shadow-sm'
                }`}
              />
            ))}
          </div>

          {/* Top Indicator Arrow / Needle */}
          <div className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none drop-shadow-md">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-rose-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300 -mt-1 border border-white" />
          </div>

          {/* Rotating SVG Wheel */}
          <svg
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-full relative z-10 transition-all"
            viewBox="0 0 200 200"
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              transition: isSpinning
                ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.2, 1)'
                : 'none'
            }}
          >
            {SPIN_PRIZES.map((prize, idx) => {
              const startAngle = idx * sliceAngle;
              const endAngle = (idx + 1) * sliceAngle;
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;

              const x1 = 100 + 100 * Math.cos(startRad);
              const y1 = 100 + 100 * Math.sin(startRad);
              const x2 = 100 + 100 * Math.cos(endRad);
              const y2 = 100 + 100 * Math.sin(endRad);

              const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`;
              const midAngle = startAngle + sliceAngle / 2;

              return (
                <g key={prize.id}>
                  {/* Slice Wedge */}
                  <path
                    d={pathData}
                    fill={prize.color}
                    stroke="#FFFDF9"
                    strokeWidth="1.5"
                  />
                  {/* Slice Label & Icon */}
                  <g
                    transform={`rotate(${midAngle}, 100, 100) translate(100, 30)`}
                  >
                    <text
                      textAnchor="middle"
                      fill={prize.textColor}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="system-ui"
                      transform="rotate(90)"
                    >
                      {prize.icon} {prize.label.length > 14 ? prize.label.slice(0, 12) + '..' : prize.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Center Hub Button */}
          <button
            onClick={handleStartSpin}
            disabled={isSpinning}
            className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-[#3B281B] to-[#5C3A21] border-4 border-amber-300 text-amber-200 font-black text-xs shadow-xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-80 disabled:cursor-not-allowed group cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 mb-0.5 text-amber-300 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
            <span className="text-[10px] tracking-wider uppercase font-black">
              {isSpinning ? 'SPINNING' : 'SPIN'}
            </span>
          </button>
        </div>

        {/* Result Announcement or Phone Gate */}
        {wonPrize ? (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center animate-in zoom-in-95 space-y-2">
            <div className="text-3xl animate-bounce">{wonPrize.icon}</div>
            <h4 className="font-black text-base text-[#241A14]">
              {wonPrize.isWin ? `You Won: ${wonPrize.label}!` : 'Nice Try!'}
            </h4>
            <p className="text-xs text-[#665A4F]">{wonPrize.description}</p>

            {wonPrize.code ? (
              <div className="pt-2 space-y-2">
                <div className="p-2 rounded-xl bg-white border border-dashed border-[#5C3A21] font-mono text-xs font-black text-[#5C3A21] flex items-center justify-between px-3">
                  <span>Coupon: {wonPrize.code}</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-sans">
                    Auto-Eligible
                  </span>
                </div>
                {onApplyPrize && (
                  <button
                    onClick={handleApplyToCart}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#5C3A21] hover:bg-[#4A2E1A] text-white font-extrabold text-xs shadow-md shadow-[#5C3A21]/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Apply Reward to My Bill</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onClose}
                className="mt-2 text-xs font-bold text-[#5C3A21] underline hover:text-[#241A14]"
              >
                Continue to Menu
              </button>
            )}
          </div>
        ) : (
          <div className="mt-3 space-y-2.5 text-left">
            <label className="text-[11px] font-bold text-[#5C3A21] block">
              Enter 10-Digit Mobile Number to Unlock Spin:
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7A6E]" />
              <input
                type="tel"
                maxLength={10}
                value={phoneInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhoneInput(val);
                  checkSpunStatus(val);
                }}
                disabled={isSpinning}
                placeholder="e.g. 9876543210"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E0D5] text-xs font-bold text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#5C3A21] shadow-xs"
              />
            </div>

            {errorMsg && (
              <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}

            {hasSpunToday ? (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <p className="text-xs font-bold text-amber-900">
                  You already claimed today's lucky spin!
                </p>
                <p className="text-[10px] text-amber-700 mt-0.5">
                  Come back tomorrow for your next spin.
                </p>
              </div>
            ) : (
              <button
                onClick={handleStartSpin}
                disabled={isSpinning || phoneInput.length < 10}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E58A3A] to-[#D77A28] hover:from-[#D77A28] hover:to-[#B6621B] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#E58A3A]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSpinning ? 'Spinning...' : 'Spin The Wheel Now'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
