import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Award,
  Sparkles,
  Gift,
  CheckCircle2,
  Lock,
  Plus,
  ShieldCheck,
  Tag,
  Coffee,
  HeartHandshake
} from 'lucide-react';

export default function LoyaltyPage() {
  const { coupons, settings, setSettings, addToast, triggerConfetti } = useCafe();
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newMinBill, setNewMinBill] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const milestones = [
    {
      visit: 1,
      title: 'First Visit (Onboarding)',
      reward: 'Welcome Offer: 10% OFF on next visit',
      rule: 'Customer enters phone number; system auto-creates CRM profile.',
      badge: 'Welcome Tier',
      color: 'border-blue-400 bg-blue-50/50'
    },
    {
      visit: 2,
      title: 'Second Visit (Engagement)',
      reward: 'Visit Count Updated + Loyalty Points Earned',
      rule: '1 Loyalty Point per ₹10 spent. Order history automatically synced.',
      badge: 'Silver Tier',
      color: 'border-gray-400 bg-gray-50/50'
    },
    {
      visit: 3,
      title: 'Third Visit (Surprise)',
      reward: 'Special Reward: ₹30 OFF Instant Coupon',
      rule: 'Automatically unlocked upon completing third paid bill.',
      badge: 'Gold Tier',
      color: 'border-amber-400 bg-amber-50/50'
    },
    {
      visit: 4,
      title: 'Fourth Visit (Retention)',
      reward: 'Milestone Progress Tracker (80% Complete)',
      rule: 'Shows guest they are just 1 order away from ₹50 OFF.',
      badge: 'Platinum Tier',
      color: 'border-purple-400 bg-purple-50/50'
    },
    {
      visit: 5,
      title: 'Fifth Visit (Major Milestone)',
      reward: '₹50 OFF Coupon Unlocked + Confetti Celebration',
      rule: 'Strict check: Counts ONLY on payment completion. Duplicate prevention active.',
      badge: 'Ruby VIP Tier',
      color: 'border-rose-400 bg-rose-50/50'
    },
    {
      visit: 10,
      title: 'Tenth Visit (Super VIP)',
      reward: 'Complimentary Handcrafted Coffee or Burger (₹220 Value)',
      rule: 'CafeFlow VIP status unlocked for lifetime free drink upgrades.',
      badge: 'Black Diamond Tier',
      color: 'border-[#5C3A21] bg-amber-100/50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241A14] flex items-center gap-2">
            <Award className="w-6 h-6 text-[#5C3A21]" />
            Loyalty & Customer Rewards Architecture
          </h2>
          <p className="text-xs text-[#8A7A6E]">
            Automated milestone rewards program driving guest retention from 1st to 10th visit.
          </p>
        </div>

        <button
          onClick={() => {
            triggerConfetti();
            addToast('Triggering celebration animation demo!', 'success');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E58A3A] hover:bg-[#D77A28] text-white text-xs font-bold shadow-md shadow-[#E58A3A]/20 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Test Confetti Celebration</span>
        </button>
      </div>

      {/* Strict Anti-Fraud / Business Rules Callout */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-extrabold text-emerald-900 text-sm">
            Strict Loyalty Accounting Safeguards
          </h4>
          <p className="text-emerald-800">
            • <strong>Post-Payment Counting:</strong> Customer visits are credited <em>only after</em> the order is marked completed and payment is confirmed in the POS or Admin.
          </p>
          <p className="text-emerald-800">
            • <strong>Duplicate Prevention:</strong> Each order ID is strictly indexed in the customer profile. An order cannot increment visit counts twice under any circumstance.
          </p>
        </div>
      </div>

      {/* Visual Roadmap of Milestones */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
          <h3 className="font-extrabold text-base text-[#241A14] flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#E58A3A]" />
            The 6-Step Guest Retention Roadmap
          </h3>
          <span className="text-xs font-bold text-[#8A7A6E]">Automatic Trigger Flow</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {milestones.map(m => (
            <div
              key={m.visit}
              className={`p-4 rounded-2xl border ${m.color} flex flex-col justify-between space-y-3 transition-transform hover:-translate-y-0.5`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-white rounded-full border border-current text-[#5C3A21]">
                    {m.badge}
                  </span>
                  <span className="text-xs font-extrabold text-[#5C3A21]">
                    Visit #{m.visit}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#241A14]">
                  {m.title}
                </h4>

                <div className="mt-2 p-2 bg-white/80 rounded-xl border border-current/20 text-xs font-bold text-[#5C3A21]">
                  🎁 {m.reward}
                </div>

                <p className="text-[11px] text-[#665A4F] mt-2">
                  {m.rule}
                </p>
              </div>

              <div className="pt-2 border-t border-current/20 flex items-center justify-between text-[10px] font-bold text-[#8A7A6E]">
                <span>Status: Active Rule</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active System Coupons & Promo Codes */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
          <div>
            <h3 className="font-extrabold text-base text-[#241A14] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#5C3A21]" />
              Configured Promotional & Milestone Coupons
            </h3>
            <p className="text-xs text-[#8A7A6E]">Coupons verifiable in POS and Customer QR Checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {coupons.map((c, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] space-y-2 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-sm text-[#5C3A21] bg-white px-2 py-0.5 rounded-lg border border-[#E8E0D5]">
                  {c.code}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>

              <p className="text-xs font-bold text-[#241A14]">
                {c.discount ? `₹${c.discount} Flat Discount` : `${c.discountPercent}% Off`}
              </p>

              <p className="text-[11px] text-[#665A4F]">
                {c.description}
              </p>

              <div className="text-[10px] text-[#8A7A6E] pt-2 border-t border-[#E8E0D5]">
                Min Bill: {c.minBill ? formatCurrency(c.minBill) : 'No Min'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
