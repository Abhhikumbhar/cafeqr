import React from 'react';
import {
  Award,
  Sparkles,
  Check,
  Gift,
  Coffee,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function LoyaltyPunchCard({
  customer,
  onApplyCoupon,
  compact = false
}) {
  const visitCount = customer?.visitCount || 0;
  const currentStamps = visitCount % 5; // e.g. 3 visits = 3 stamps; 5 visits = 5 stamps
  const effectiveStamps = visitCount > 0 && currentStamps === 0 ? 5 : currentStamps;
  const visitsRemaining = Math.max(0, 5 - effectiveStamps);

  const stampsConfig = [
    {
      step: 1,
      title: '1st Visit',
      reward: '10% OFF Welcome',
      code: 'CHAI10',
      icon: '🎉'
    },
    {
      step: 2,
      title: '2nd Visit',
      reward: 'Silver Points',
      code: null,
      icon: '☕'
    },
    {
      step: 3,
      title: '3rd Visit',
      reward: '₹30 Treat',
      code: 'TREAT30',
      icon: '🌟'
    },
    {
      step: 4,
      title: '4th Visit',
      reward: 'Almost VIP',
      code: null,
      icon: '🔥'
    },
    {
      step: 5,
      title: '5th Visit',
      reward: 'FREE Drink / ₹50 OFF',
      code: 'FIFTHVISIT50',
      icon: '🎁'
    }
  ];

  return (
    <div className={`rounded-3xl border-2 transition-all overflow-hidden ${
      effectiveStamps === 5
        ? 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E8] to-[#F5E6CE] border-[#D4AF37] shadow-lg shadow-amber-500/10'
        : 'bg-gradient-to-br from-[#FFFDF9] to-[#FAF7F2] border-[#E8E0D5] shadow-sm'
    } ${compact ? 'p-3.5' : 'p-5'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E0D5]/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5C3A21] to-[#3B281B] text-amber-300 flex items-center justify-center shadow-xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-xs sm:text-sm text-[#241A14]">
                The 7 Cafe VIP Punch Pass
              </h4>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-[#5C3A21] border border-amber-300">
                5-Visit Rewards
              </span>
            </div>
            <p className="text-[10px] text-[#8A7A6E]">
              {customer?.name ? `${customer.name} • ` : ''}
              {visitCount > 0 ? `${visitCount} lifetime visits` : 'Scan, order, and earn loyalty stamps'}
            </p>
          </div>
        </div>

        {/* Loyalty Points Badge */}
        {customer?.loyaltyPoints !== undefined && (
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#8A7A6E] block uppercase">
              Points
            </span>
            <span className="text-xs font-black text-[#5C3A21] bg-white px-2 py-0.5 rounded-lg border border-[#E8E0D5]">
              {customer.loyaltyPoints} pts
            </span>
          </div>
        )}
      </div>

      {/* 5-Stamp Punch Grid */}
      <div className="py-4">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {stampsConfig.map((st) => {
            const isCompleted = effectiveStamps >= st.step;
            const isCurrentTarget = effectiveStamps + 1 === st.step;
            const isJackpot = st.step === 5;

            return (
              <div
                key={st.step}
                className={`relative rounded-2xl p-2 text-center transition-all flex flex-col items-center justify-between min-h-[78px] sm:min-h-[86px] ${
                  isCompleted
                    ? isJackpot
                      ? 'bg-gradient-to-b from-amber-400 to-[#D4AF37] text-white shadow-md border-2 border-white'
                      : 'bg-[#5C3A21] text-amber-100 border border-[#5C3A21] shadow-xs'
                    : isCurrentTarget
                    ? 'bg-amber-50 border-2 border-dashed border-[#E58A3A] text-[#5C3A21] animate-pulse'
                    : 'bg-white/80 border border-dashed border-[#D5C9BD] text-gray-400'
                }`}
              >
                {/* Stamp Icon */}
                <div className="relative mt-1">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-xs">
                      {isJackpot ? '👑' : <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                  ) : (
                    <span className="text-sm opacity-60">{st.icon}</span>
                  )}
                </div>

                {/* Step label */}
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-tight block ${
                    isCompleted ? 'text-white' : 'text-[#8A7A6E]'
                  }`}>
                    {st.title}
                  </span>
                  <span className={`text-[8px] font-semibold leading-tight line-clamp-2 mt-0.5 ${
                    isCompleted
                      ? isJackpot ? 'text-white font-black' : 'text-amber-200'
                      : 'text-gray-400'
                  }`}>
                    {st.reward}
                  </span>
                </div>

                {/* Stamp Number Pill */}
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                  isCompleted
                    ? 'bg-black/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  #{st.step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Message */}
      <div className="bg-white/90 p-3 rounded-2xl border border-[#E8E0D5] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-[#E58A3A] shrink-0" />
          <p className="text-[11px] text-[#665A4F] truncate">
            {effectiveStamps >= 5 ? (
              <strong className="text-emerald-700 font-extrabold">
                🎉 Congratulations! 5th Visit Unlocked! Free drink or ₹50 OFF ready!
              </strong>
            ) : visitsRemaining === 1 ? (
              <span>
                You are only <strong>1 visit away</strong> from your <strong>Free Drink / ₹50 OFF</strong>!
              </span>
            ) : (
              <span>
                <strong>{effectiveStamps}/5 Stamps Collected.</strong> Complete {visitsRemaining} more visits for VIP Reward!
              </span>
            )}
          </p>
        </div>

        {/* 5th Visit Quick Redeem Button */}
        {effectiveStamps >= 5 && onApplyCoupon && (
          <button
            onClick={() => onApplyCoupon('FIFTHVISIT50')}
            className="shrink-0 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:from-amber-600 hover:to-[#B89628] text-white text-[10px] font-black shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            Apply ₹50 OFF
          </button>
        )}
      </div>

      {/* Unlocked Customer Coupons list */}
      {customer?.availableCoupons && customer.availableCoupons.length > 0 && onApplyCoupon && (
        <div className="mt-3 pt-3 border-t border-[#E8E0D5]/70 space-y-1.5">
          <span className="text-[10px] font-black text-[#5C3A21] uppercase tracking-wider block">
            Your Unlocked Rewards:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {customer.availableCoupons.map((cp, idx) => (
              <button
                key={idx}
                onClick={() => onApplyCoupon(cp.code)}
                className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#5C3A21] border border-amber-300 text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                title="Click to apply coupon"
              >
                <Tag className="w-3 h-3 text-[#E58A3A]" />
                <span>{cp.code}</span>
                <span className="text-[9px] text-emerald-700 font-black">
                  ({cp.discount ? `₹${cp.discount}` : `${cp.discountPercent}%`} OFF)
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
