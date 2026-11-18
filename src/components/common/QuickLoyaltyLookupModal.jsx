import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import LoyaltyPunchCard from './LoyaltyPunchCard';
import {
  Search,
  Phone,
  User,
  Award,
  Sparkles,
  Gift,
  ShoppingBag,
  Clock,
  CheckCircle2,
  X,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function QuickLoyaltyLookupModal({ isOpen, onClose }) {
  const { customers, getCustomerByPhone, orders } = useCafe();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber('');
      setFoundCustomer(null);
      setHasSearched(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const clean = phoneNumber.replace(/\D/g, '').slice(-10);
    if (clean.length === 10) {
      const cust = getCustomerByPhone(clean);
      setFoundCustomer(cust || null);
      setHasSearched(true);
    } else if (clean.length === 0) {
      setFoundCustomer(null);
      setHasSearched(false);
    }
  }, [phoneNumber, customers]);

  if (!isOpen) return null;

  const clean = phoneNumber.replace(/\D/g, '').slice(-10);

  // Get orders for this customer
  const customerOrders = foundCustomer
    ? orders.filter(o => (o.customerPhone || '').replace(/\D/g, '').slice(-10) === clean)
    : [];

  const handleOpenInPos = () => {
    onClose();
    navigate(`/admin/pos?phone=${encodeURIComponent(clean)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8E0D5] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#241A14] to-[#5C3A21] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-[#E58A3A]/25 border border-[#E58A3A]/40 text-[#E58A3A]">
              <Award className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
                <span>Quick Loyalty Lookup</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 font-bold uppercase">
                  Admin Fast Flow
                </span>
              </h3>
              <p className="text-xs text-[#C8BAAA]">
                Type 10-digit number for 1-second stamps & points check
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 border-b border-[#E8E0D5] bg-[#FAF7F2]">
          <div className="relative">
            <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E58A3A]" />
            <input
              ref={inputRef}
              type="tel"
              maxLength={10}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter customer mobile (e.g. 8530790727)"
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border-2 border-[#E8E0D5] focus:border-[#5C3A21] text-sm font-mono font-bold text-[#241A14] placeholder-gray-400 focus:outline-none shadow-sm text-base"
            />
            {phoneNumber && (
              <button
                onClick={() => setPhoneNumber('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#8A7A6E] mt-1.5 flex items-center justify-between">
            <span>Instant search as you type 10 digits</span>
            <span className="font-mono">{clean.length}/10 digits</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!hasSearched ? (
            <div className="py-10 text-center text-[#8A7A6E] space-y-2">
              <Award className="w-12 h-12 mx-auto text-[#D1C2B0]" />
              <p className="text-sm font-bold text-[#241A14]">Ready for instant guest lookup</p>
              <p className="text-xs max-w-xs mx-auto">
                Ask the customer for their mobile number to verify VIP stamps, unlocked coupons, and total spend in 1 second.
              </p>
            </div>
          ) : foundCustomer ? (
            /* FOUND REGISTERED CUSTOMER */
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#5C3A21] text-white font-black text-lg flex items-center justify-center shadow-md shadow-[#5C3A21]/20">
                    {foundCustomer.name ? foundCustomer.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#241A14] flex items-center gap-2">
                      <span>{foundCustomer.name || 'Valued Guest'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5C3A21] text-white font-black uppercase">
                        Visit #{foundCustomer.totalVisits || 1}
                      </span>
                    </h4>
                    <p className="text-xs text-[#5C3A21] font-mono font-semibold">
                      +91 {foundCustomer.phone}
                    </p>
                    <p className="text-[10px] text-[#8A7A6E]">
                      Member since {foundCustomer.memberSince || 'Recent'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#8A7A6E] uppercase font-bold block">
                    Points Balance
                  </span>
                  <span className="text-lg font-black text-[#5C3A21]">
                    {foundCustomer.loyaltyPoints || 0} pts
                  </span>
                </div>
              </div>

              {/* 5-Stamp Digital Pass */}
              <LoyaltyPunchCard
                customer={foundCustomer}
                compact={false}
              />

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] text-left">
                  <span className="text-[10px] font-bold text-[#8A7A6E] uppercase block">
                    Lifetime Cafe Spend
                  </span>
                  <span className="text-sm font-black text-[#241A14]">
                    {formatCurrency(foundCustomer.totalSpent || 0)}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] text-left">
                  <span className="text-[10px] font-bold text-[#8A7A6E] uppercase block">
                    Completed Bills
                  </span>
                  <span className="text-sm font-black text-[#241A14]">
                    {customerOrders.length || foundCustomer.totalVisits || 1} Orders
                  </span>
                </div>
              </div>

              {/* Unlocked Offers */}
              {foundCustomer.availableCoupons?.length > 0 && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Unlocked Rewards Available:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {foundCustomer.availableCoupons.map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-extrabold shadow-2xs"
                      >
                        🎁 {c.title || c.code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* NEW / UNREGISTERED NUMBER */
            <div className="py-8 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#E58A3A] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#241A14]">
                  New Customer (+91 {clean})
                </h4>
                <p className="text-xs text-[#8A7A6E] max-w-xs mx-auto mt-1">
                  This mobile number has not completed an order yet. Their 1st order will automatically unlock:
                </p>
                <div className="inline-block mt-3 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black">
                  🎉 1st Stamp + Welcome 10% OFF Reward!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#E8E0D5] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#665A4F] hover:bg-[#FAF7F2] transition-colors"
          >
            Close
          </button>

          {clean.length === 10 && (
            <button
              onClick={handleOpenInPos}
              className="py-2.5 px-5 rounded-2xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#E58A3A]" />
              <span>Open in POS Bill (+91 {clean.slice(-4)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
