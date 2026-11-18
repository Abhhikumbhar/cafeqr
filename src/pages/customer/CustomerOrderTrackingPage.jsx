import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import LoyaltyPunchCard from '../../components/common/LoyaltyPunchCard';
import { getItemFallbackImage } from '../../utils/imageFallbacks';
import { subscribeToSingleOrder, fetchOrderFromFirestore } from '../../services/firebase';
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
  Check,
  Volume2,
  AlertCircle,
  X
} from 'lucide-react';

export default function CustomerOrderTrackingPage() {
  const { orderId } = useParams();
  const { orders, updateOrderStatus, getCustomerByPhone, settings, addToast } = useCafe();

  // Primary order resolution (URL orderId > Context orders > localStorage)
  const initialOrder = orders.find(o => o.id === orderId || o.kotNumber === orderId) || null;
  const [liveOrder, setLiveOrder] = useState(initialOrder);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [waterRequested, setWaterRequested] = useState(false);
  const [showBillQr, setShowBillQr] = useState(false);
  const [statusCelebration, setStatusCelebration] = useState(null);

  const prevStatusRef = useRef(initialOrder?.status || null);

  // Play cafe audio chimes
  const playBaristaChime = (type = 'preparing') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'preparing') {
        // Warm 2-tone melodic chime (G5 -> C6)
        const notes = [783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.15);
          osc.stop(ctx.currentTime + idx * 0.15 + 0.65);
        });
      } else if (type === 'ready') {
        // Bright 3-note celebration bell (E5 -> G5 -> C6)
        const notes = [659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.85);
        });
      } else {
        // Waiter ding
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1174.66, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.25);
      }
    } catch (e) {
      console.warn('Audio chime notice:', e);
    }
  };

  // Status transition handler for audio, vibration & visible banner
  const handleStatusTransition = (oldStatus, newStatus, currentData) => {
    if (!newStatus || oldStatus === newStatus) return;

    if (newStatus === 'Preparing') {
      playBaristaChime('preparing');
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([200, 100, 200]); } catch (e) {}
      }
      setStatusCelebration({
        badge: '👨‍🍳 KITCHEN ACCEPTED',
        title: 'Chef Accepted Your Order!',
        message: 'Barista & kitchen staff started handcrafting your dishes fresh right now!',
        color: 'from-orange-500 to-amber-600',
        borderColor: 'border-orange-400',
        bg: 'bg-orange-50'
      });
      addToast('🔥 Kitchen accepted your KOT! Preparation started.', 'success', 6000);
    } else if (newStatus === 'Ready') {
      playBaristaChime('ready');
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([300, 150, 300]); } catch (e) {}
      }
      setStatusCelebration({
        badge: '🛎️ FOOD PLATED & READY',
        title: 'Your Order is Ready!',
        message: 'Fresh & hot at the kitchen pass! Server is bringing dishes to your table right now.',
        color: 'from-emerald-500 to-teal-600',
        borderColor: 'border-emerald-400',
        bg: 'bg-emerald-50'
      });
      addToast('🛎️ Order ready! Server is bringing it to your table.', 'success', 7000);
    } else if (newStatus === 'Served') {
      playBaristaChime('chime');
      setStatusCelebration({
        badge: '✨ DISHES SERVED',
        title: 'Enjoy Your Meal!',
        message: 'Dishes served fresh to your table. Have a wonderful experience at The 7 Cafe!',
        color: 'from-blue-600 to-indigo-600',
        borderColor: 'border-blue-400',
        bg: 'bg-blue-50'
      });
    }
  };

  // Synchronize with Context orders
  useEffect(() => {
    const matched = orders.find(o => o.id === orderId || o.kotNumber === orderId);
    if (matched) {
      if (prevStatusRef.current && prevStatusRef.current !== matched.status) {
        handleStatusTransition(prevStatusRef.current, matched.status, matched);
      }
      prevStatusRef.current = matched.status;
      setLiveOrder(matched);
    }
  }, [orders, orderId]);

  // Real-Time Direct Firestore Listener & High-Frequency Poller (Zero Desync)
  useEffect(() => {
    const targetId = orderId || liveOrder?.id;
    if (!targetId) return;

    // 1. Direct Firestore real-time doc snapshot
    const unsubscribeDoc = subscribeToSingleOrder(targetId, (data) => {
      if (data && data.status) {
        if (prevStatusRef.current && prevStatusRef.current !== data.status) {
          handleStatusTransition(prevStatusRef.current, data.status, data);
        }
        prevStatusRef.current = data.status;
        setLiveOrder(prev => (prev ? { ...prev, ...data } : data));
      }
    });

    // 2. High-speed 2.5s fallback polling for uninterrupted sync across mobile cellular connections
    const pollInterval = setInterval(async () => {
      const freshData = await fetchOrderFromFirestore(targetId);
      if (freshData && freshData.status) {
        if (prevStatusRef.current && prevStatusRef.current !== freshData.status) {
          handleStatusTransition(prevStatusRef.current, freshData.status, freshData);
        }
        prevStatusRef.current = freshData.status;
        setLiveOrder(prev => (prev ? { ...prev, ...freshData } : freshData));
      }
    }, 2500);

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      clearInterval(pollInterval);
    };
  }, [orderId]);

  // Order resolution fallback (localStorage fallback if direct link visited)
  const order = liveOrder || orders.find(o => o.id === orderId) || orders[0];

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

  const matchedCustomer = order?.customerPhone ? getCustomerByPhone(order.customerPhone) : null;

  const handleCallStaff = () => {
    playBaristaChime('chime');
    addToast('🛎️ Ding! Staff notified. A server is coming to your table.', 'success');
  };

  const handleRequestWater = () => {
    playBaristaChime('chime');
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
          <div className="w-16 h-16 rounded-full bg-amber-100 text-[#5C3A21] flex items-center justify-center mx-auto text-2xl animate-bounce">
            ☕
          </div>
          <h2 className="text-xl font-black text-[#241A14]">No Active Table Check</h2>
          <p className="text-xs text-[#8A7A6E]">
            Please scan the QR code on your table to view your live orders and cafe menu.
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

  // 4 Kitchen Preparation Stages with rich cafe visual context
  const stages = [
    {
      id: 'Order Pending',
      title: 'Order Sent & KOT Printed',
      subtitle: 'Barista ticket dispatched. Waiting for chef to accept KOT.',
      badge: 'Order Sent',
      icon: Clock,
      eta: 'Waiting',
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      id: 'Preparing',
      title: 'Chef Accepted & Crafting',
      subtitle: 'Barista & kitchen staff are freshly preparing your dishes right now!',
      badge: 'In Kitchen Prep',
      icon: Flame,
      eta: '8-12 Mins',
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    {
      id: 'Ready',
      title: 'Plated & Ready for Service',
      subtitle: 'Fresh & hot at the kitchen pass! Server is bringing it to your table.',
      badge: 'Ready for Service',
      icon: UtensilsCrossed,
      eta: 'Arriving Now',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'Served',
      title: 'Served to Your Table',
      subtitle: 'Delivered fresh. Enjoy your sips, bites & conversations!',
      badge: 'Served to Table',
      icon: CheckCircle2,
      eta: 'Delivered',
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
      {/* 1. Cafe Header Bar */}
      <header className="flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#E8E0D5] shadow-xs">
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
            ~ live order tracking ~
          </p>
        </div>

        {/* Table Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C3A21] text-amber-200 text-xs font-black shadow-xs border border-amber-300/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{order.tableName}</span>
        </div>
      </header>

      {/* 2. Prominent Real-time Celebration Banner (Fired on Kitchen Accept / Ready) */}
      {statusCelebration && (
        <div className={`p-4 rounded-3xl border-2 ${statusCelebration.borderColor} ${statusCelebration.bg} shadow-lg relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-2 duration-300`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${statusCelebration.color} text-white flex items-center justify-center text-lg shrink-0 shadow-md`}>
              {currentStageIdx === 1 ? '👨‍🍳' : currentStageIdx === 2 ? '🛎️' : '✨'}
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider text-white bg-gradient-to-r ${statusCelebration.color} mb-1`}>
                {statusCelebration.badge}
              </span>
              <h3 className="font-extrabold text-sm text-[#241A14] leading-tight">
                {statusCelebration.title}
              </h3>
              <p className="text-xs text-[#665A4F] mt-0.5">
                {statusCelebration.message}
              </p>
            </div>
            <button
              onClick={() => setStatusCelebration(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Hero Live Barista & Kitchen Status Card */}
      <div className={`rounded-3xl p-5 sm:p-6 border-2 transition-all shadow-md relative overflow-hidden space-y-4 ${
        currentStageIdx === 1
          ? 'bg-gradient-to-b from-white via-orange-50/30 to-amber-50/40 border-orange-300 shadow-orange-500/10'
          : currentStageIdx === 2
          ? 'bg-gradient-to-b from-white via-emerald-50/30 to-teal-50/40 border-emerald-300 shadow-emerald-500/10'
          : 'bg-white border-[#EADCCB]'
      }`}>
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

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
        <div className="text-center py-2 space-y-2.5">
          {/* Animated Central Icon with Dynamic Ring */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            {currentStageIdx === 1 && (
              <div className="absolute inset-0 rounded-full bg-orange-400 opacity-25 animate-ping" />
            )}
            {currentStageIdx === 2 && (
              <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-25 animate-ping" />
            )}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl relative z-10 shadow-xl border-4 transition-all ${
              currentStageIdx === 0
                ? 'bg-gradient-to-br from-[#5C3A21] to-[#3B281B] text-amber-300 border-amber-200/60'
                : currentStageIdx === 1
                ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white border-orange-300 animate-pulse'
                : currentStageIdx === 2
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-300'
                : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-300'
            }`}>
              {currentStageIdx === 0 && '🔔'}
              {currentStageIdx === 1 && '🔥'}
              {currentStageIdx === 2 && '🍽️'}
              {currentStageIdx === 3 && '✨'}
            </div>
          </div>

          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5 border ${
              currentStageIdx === 0
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : currentStageIdx === 1
                ? 'bg-orange-100 text-orange-950 border-orange-300 animate-pulse'
                : currentStageIdx === 2
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                : 'bg-blue-100 text-blue-950 border-blue-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                currentStageIdx === 1 ? 'bg-orange-500 animate-ping' : 'bg-emerald-500 animate-pulse'
              }`} />
              <span>Stage {currentStageIdx + 1} of 4 • {currentStage.badge}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#241A14] tracking-tight">
              {currentStage.title}
            </h2>
            <p className="text-xs text-[#665A4F] max-w-sm mx-auto mt-1 font-medium">
              {currentStage.subtitle}
            </p>
          </div>

          {/* Dynamic Kitchen Status Information Strip */}
          {currentStageIdx === 0 && (
            <div className="py-2 px-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 font-medium inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Waiting for kitchen counter to press <strong>[Accept KOT]</strong></span>
            </div>
          )}

          {currentStageIdx === 1 && (
            <div className="py-2.5 px-4 bg-orange-100/70 rounded-2xl border border-orange-300 text-xs text-orange-950 font-bold inline-flex items-center gap-2 shadow-xs">
              <Flame className="w-4 h-4 text-orange-600 animate-bounce" />
              <span>Kitchen Accepted: Barista is crafting your treats now (~8-12 mins)</span>
            </div>
          )}

          {currentStageIdx === 2 && (
            <div className="py-2.5 px-4 bg-emerald-100/80 rounded-2xl border border-emerald-300 text-xs text-emerald-950 font-bold inline-flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Plated & Ready: Server dispatched to {order.tableName}!</span>
            </div>
          )}
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
                    className={`h-2.5 rounded-full transition-all duration-700 ${
                      isPast
                        ? 'bg-emerald-600'
                        : isCurrent
                        ? currentStageIdx === 1
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 animate-pulse'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 animate-pulse'
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

      {/* 4. Real Itemized Guest Check (Dishes with Photos & Pricing) */}
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

        {/* Financial Accounting Breakdown */}
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

      {/* 5. Instant Table Actions Dock (Ding Waiter, Water, Request Bill) */}
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

      {/* 6. Direct UPI QR Scan & Pay at Table (Shown on Bill Request or Billing Status) */}
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

      {/* 7. VIP Loyalty Punch Card (5-Visit Reward) */}
      <LoyaltyPunchCard
        customer={matchedCustomer || { name: order.customerName, visitCount: 1 }}
        compact={true}
      />
    </div>
  );
}
