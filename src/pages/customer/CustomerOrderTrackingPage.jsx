import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import LoyaltyPunchCard from '../../components/common/LoyaltyPunchCard';
import { getItemFallbackImage } from '../../utils/imageFallbacks';
import { QRCodeSVG } from 'qrcode.react';
import {
  Coffee,
  CheckCircle2,
  Clock,
  Flame,
  UtensilsCrossed,
  BellRing,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  QrCode,
  ChefHat,
  Droplets,
  Receipt,
  Heart,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function CustomerOrderTrackingPage() {
  const { orderId } = useParams();
  const { orders, updateOrderStatus, getCustomerByPhone, settings, addToast } = useCafe();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [waterRequested, setWaterRequested] = useState(false);
  const [showBillQr, setShowBillQr] = useState(false);

  // Find target order
  const order = orders.find(o => o.id === orderId) || orders[0];
  const matchedCustomer = order?.customerPhone ? getCustomerByPhone(order.customerPhone) : null;

  // Track elapsed timer
  useEffect(() => {
    if (!order?.createdAt) return;
    const calculateElapsed = () => {
      const createdTime = new Date(order.createdAt).getTime();
      const diffSecs = Math.max(0, Math.floor((Date.now() - createdTime) / 1000));
      setElapsedSeconds(diffSecs);
    };
    calculateElapsed();
    const interval = setInterval(calculateElapsed, 5000);
    return () => clearInterval(interval);
  }, [order?.createdAt]);

  // Acoustic waiter ding sound
  const playWaiterChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6 note
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.25);
    } catch {}
  };

  const handleCallStaff = () => {
    playWaiterChime();
    addToast('🛎️ Ding! Staff notified. A server is coming to your table.', 'success');
  };

  const handleRequestWater = () => {
    playWaiterChime();
    setWaterRequested(true);
    addToast('💧 Water requested! Server is bringing fresh water to your table.', 'info');
  };

  const handleRequestBill = () => {
    if (order) {
      updateOrderStatus(order.id, 'Billing');
      setShowBillQr(true);
      addToast('🧾 Bill requested! Digital check generated for instant Scan & Pay.', 'success');
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-[#5C3A21] flex items-center justify-center mx-auto text-2xl">
            ☕
          </div>
          <h2 className="text-xl font-black text-[#241A14]">No Active Table Check</h2>
          <p className="text-xs text-[#8A7A6E]">
            Please scan the QR code on your table to view your live orders and menu.
          </p>
          <Link
            to="/menu"
            className="inline-block px-5 py-2.5 rounded-2xl bg-[#5C3A21] text-white text-xs font-bold shadow-md hover:bg-[#4B2E19] transition-all"
          >
            Explore Cafe Menu
          </Link>
        </div>
      </div>
    );
  }

  // 4 Kitchen Preparation Stages
  const stages = [
    {
      id: 'Order Pending',
      title: 'Order Sent & KOT Printed',
      subtitle: 'Barista & Chef ticket generated',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      id: 'Preparing',
      title: 'Brewing & Freshly Handcrafting',
      subtitle: 'Barista is steaming & crafting your dishes',
      icon: Flame,
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    {
      id: 'Ready',
      title: 'Plated & Ready for Serving',
      subtitle: 'Hot & fresh at kitchen pass, server dispatched',
      icon: UtensilsCrossed,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'Served',
      title: 'Served to Your Table',
      subtitle: 'Enjoy your sips, bites & conversations!',
      icon: CheckCircle2,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'Order Pending':
      case 'Occupied':
        return 0;
      case 'Preparing':
        return 1;
      case 'Ready':
        return 2;
      case 'Served':
      case 'Billing':
      case 'Completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(order.status);
  const currentStage = stages[currentStageIdx];
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  // Financial calculations
  const subtotal = order.subtotal || order.items.reduce((s, it) => s + (it.price * it.quantity), 0);
  const gstAmount = order.gst || Math.round(subtotal * 0.05 * 100) / 100;
  const discountAmount = order.discount || 0;
  const netTotal = order.total || Math.max(0, subtotal + gstAmount - discountAmount);

  const cafeUpiId = settings?.upiId || 'the7cafe@okhdfcbank';
  const cafeName = settings?.cafeName || 'The 7 Cafe';
  const upiPayString = `upi://pay?pa=${encodeURIComponent(cafeUpiId)}&pn=${encodeURIComponent(cafeName)}&am=${netTotal}&cu=INR&tn=Table-${order.tableName}-Bill`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#F6F1E9] to-[#EFE7DC] text-[#241A14] flex flex-col font-sans p-3 sm:p-5 max-w-xl mx-auto w-full space-y-4 pb-24">
      {/* 1. Elegant Cafe Header Bar */}
      <header className="flex items-center justify-between bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#E8E0D5] shadow-xs">
        <Link
          to={`/menu?table=${encodeURIComponent(order.tableName)}`}
          className="flex items-center gap-1.5 text-xs font-bold text-[#5C3A21] hover:text-[#241A14] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Menu</span>
        </Link>

        {/* Cafe Identity */}
        <div className="text-center">
          <h1 className="font-aesthetic-serif italic font-extrabold text-sm sm:text-base text-[#241A14] tracking-tight">
            {cafeName}
          </h1>
          <p className="text-[9px] text-[#8A7A6E] font-medium tracking-wide">
            ~ live table session ~
          </p>
        </div>

        {/* Table Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C3A21] text-amber-200 text-xs font-black shadow-xs border border-amber-300/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{order.tableName}</span>
        </div>
      </header>

      {/* 2. Hero Live Barista & Kitchen Status Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#EADCCB] shadow-md relative overflow-hidden space-y-4">
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#5C3A21]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Live Token & Time Bar */}
        <div className="flex items-center justify-between border-b border-[#E8E0D5]/70 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-[#5C3A21]">
              <ChefHat className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A7A6E] block">
                Kitchen Token
              </span>
              <span className="text-xs font-black text-[#5C3A21]">
                {order.kotNumber || `KOT-${order.id.slice(-4)}`}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A7A6E] block">
              Elapsed Time
            </span>
            <span className="text-xs font-black text-[#241A14] inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#E58A3A]" />
              <span>{elapsedMinutes < 1 ? 'Just placed' : `${elapsedMinutes}m ago`}</span>
            </span>
          </div>
        </div>

        {/* Visual Pulse Stage Display */}
        <div className="text-center py-2 space-y-2">
          {/* Animated Central Icon with Breathing Ring */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 to-[#E58A3A] opacity-25 animate-ping" />
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#5C3A21] to-[#3B281B] text-amber-300 border-4 border-amber-200/60 shadow-xl flex items-center justify-center text-2xl sm:text-3xl relative z-10">
              {currentStageIdx === 0 && '🔔'}
              {currentStageIdx === 1 && '☕'}
              {currentStageIdx === 2 && '🍽️'}
              {currentStageIdx === 3 && '✨'}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[#5C3A21] text-[10px] font-black uppercase tracking-wider mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Stage {currentStageIdx + 1} of 4</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#241A14] tracking-tight">
              {currentStage.title}
            </h2>
            <p className="text-xs text-[#8A7A6E] max-w-sm mx-auto mt-0.5">
              {currentStage.subtitle}
            </p>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="pt-2">
          <div className="grid grid-cols-4 gap-1.5">
            {stages.map((st, idx) => {
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div key={st.id} className="space-y-1 text-center">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      isPast
                        ? 'bg-emerald-600'
                        : isCurrent
                        ? 'bg-gradient-to-r from-amber-500 to-[#E58A3A] animate-pulse'
                        : 'bg-[#EAE1D3]'
                    }`}
                  />
                  <span
                    className={`text-[9px] font-bold block truncate leading-tight ${
                      isCurrent
                        ? 'text-[#5C3A21] font-black'
                        : isPast
                        ? 'text-emerald-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {idx === 0 ? 'Received' : idx === 1 ? 'Brewing' : idx === 2 ? 'Ready' : 'Served'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Real Itemized Guest Check (Dishes with Photos & Pricing) */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E0D5] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-[#5C3A21]">
              <Receipt className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-[#241A14]">
                Itemized Guest Check
              </h3>
              <p className="text-[10px] text-[#8A7A6E]">
                {order.items?.length || 0} items ordered for {order.tableName}
              </p>
            </div>
          </div>

          {order.rounds && order.rounds.length > 1 && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-[#5C3A21] px-2.5 py-0.5 rounded-full border border-amber-300">
              {order.rounds.length} Kitchen Rounds
            </span>
          )}
        </div>

        {/* Multi-Round or Single Round Item Cards */}
        {order.rounds && order.rounds.length > 1 ? (
          <div className="space-y-4">
            {order.rounds.map((round) => (
              <div
                key={round.roundNumber}
                className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D5] space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-black text-[#5C3A21] border-b border-[#E8E0D5]/70 pb-2">
                  <span>Round {round.roundNumber} ({round.kotNumber})</span>
                  <span className="text-[10px] font-semibold text-[#8A7A6E]">
                    {formatDateTime(round.timestamp)}
                  </span>
                </div>

                <div className="space-y-2">
                  {round.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#E8E0D5] shrink-0">
                        <img
                          src={it.image || getItemFallbackImage(it)}
                          alt={it.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getItemFallbackImage(it);
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#241A14] truncate">
                          {it.quantity}x {it.name}
                        </h4>
                        <p className="text-[10px] text-[#8A7A6E]">
                          {formatCurrency(it.price)} each
                        </p>
                        {it.specialInstructions && (
                          <p className="text-[10px] text-amber-700 italic">
                            Note: "{it.specialInstructions}"
                          </p>
                        )}
                      </div>
                      <span className="font-black text-xs text-[#5C3A21] shrink-0">
                        {formatCurrency(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {order.items.map((it, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#FAF7F2] transition-colors border border-transparent hover:border-[#E8E0D5]"
              >
                <div className="w-13 h-13 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8E0D5] shrink-0">
                  <img
                    src={it.image || getItemFallbackImage(it)}
                    alt={it.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getItemFallbackImage(it);
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded-md bg-[#5C3A21] text-white text-[10px] font-black">
                      {it.quantity}x
                    </span>
                    <h4 className="font-black text-xs text-[#241A14] truncate">
                      {it.name}
                    </h4>
                  </div>
                  <p className="text-[10px] text-[#8A7A6E] mt-0.5">
                    {formatCurrency(it.price)} each
                  </p>
                  {it.specialInstructions && (
                    <p className="text-[10px] text-amber-800 italic mt-0.5">
                      Note: "{it.specialInstructions}"
                    </p>
                  )}
                </div>

                <span className="font-black text-xs text-[#5C3A21] shrink-0">
                  {formatCurrency(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Financial Accounting Breakdown (Real Cafe Receipt Totals) */}
        <div className="pt-3 border-t border-[#E8E0D5] space-y-1.5 text-xs text-[#665A4F]">
          <div className="flex justify-between">
            <span>Item Subtotal:</span>
            <span className="font-semibold text-[#241A14]">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>GST & Service Taxes (5%):</span>
            <span className="font-semibold text-[#241A14]">{formatCurrency(gstAmount)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Loyalty / Coupon Discount:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-black text-[#241A14] pt-2 border-t border-[#E8E0D5]">
            <span>Net Bill Total:</span>
            <span className="text-[#5C3A21] font-mono text-lg">{formatCurrency(netTotal)}</span>
          </div>
        </div>

        {/* Quick Add More Food & Drinks Button */}
        <div className="pt-2">
          <Link
            to={`/menu?table=${encodeURIComponent(order.tableName)}`}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-[#D77A28] hover:from-amber-600 hover:to-[#B85714] text-white font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>+ Add More Food & Drinks (Round {(order.rounds?.length || 1) + 1})</span>
          </Link>
        </div>
      </div>

      {/* 4. Instant Table Actions Dock (Ding Waiter, Water, Request Bill) */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={handleCallStaff}
          className="p-3 rounded-2xl bg-white hover:bg-amber-50 text-[#5C3A21] border border-[#E8E0D5] shadow-xs flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <BellRing className="w-4 h-4 text-[#E58A3A]" />
          <span className="text-[10px] font-black uppercase">Call Server</span>
        </button>

        <button
          onClick={handleRequestWater}
          disabled={waterRequested}
          className={`p-3 rounded-2xl border shadow-xs flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
            waterRequested
              ? 'bg-blue-50 text-blue-700 border-blue-300'
              : 'bg-white hover:bg-blue-50 text-[#5C3A21] border-[#E8E0D5]'
          }`}
        >
          <Droplets className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-black uppercase">
            {waterRequested ? 'Water Sent' : 'Water Glass'}
          </span>
        </button>

        <button
          onClick={handleRequestBill}
          className="p-3 rounded-2xl bg-[#5C3A21] hover:bg-[#4A2E1A] text-white shadow-md shadow-[#5C3A21]/30 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Receipt className="w-4 h-4 text-amber-300" />
          <span className="text-[10px] font-black uppercase text-amber-200">Request Bill</span>
        </button>
      </div>

      {/* 5. Direct UPI QR Scan & Pay at Table (Shown on Bill Request or Billing Status) */}
      {(order.status === 'Billing' || showBillQr) && (
        <div className="bg-gradient-to-br from-[#FFFDF9] via-white to-[#FAF4EB] p-5 rounded-3xl border-2 border-emerald-400 shadow-xl text-center space-y-3 animate-in zoom-in-95">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Instant Table Checkout • 0% Fee</span>
          </div>

          <div>
            <h4 className="text-base font-black text-[#241A14]">
              Pay {formatCurrency(netTotal)} from Table
            </h4>
            <p className="text-xs text-[#8A7A6E]">
              Scan QR with PhonePe / GPay or tap button below
            </p>
          </div>

          {/* Dynamic UPI QR Code */}
          <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl border border-[#E8E0D5] flex items-center justify-center shadow-xs">
            <QRCodeSVG
              value={upiPayString}
              size={135}
              level="M"
            />
          </div>

          {/* 1-Click Mobile Intent Button */}
          <a
            href={upiPayString}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all block text-center cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Open PhonePe / GPay / Paytm to Pay</span>
          </a>

          <p className="text-[10px] text-[#8A7A6E] font-mono">
            Direct Bank UPI: {cafeUpiId}
          </p>
        </div>
      )}

      {/* 6. VIP Loyalty Punch Card (5-Visit Reward) */}
      <LoyaltyPunchCard
        customer={matchedCustomer || { name: order.customerName, visitCount: 1 }}
        compact={true}
      />
    </div>
  );
}
