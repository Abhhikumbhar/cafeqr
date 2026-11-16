import React, { useState, useEffect } from 'react';
import { useCafe } from '../../context/CafeContext';
import { formatTimeAgo, formatDateTime } from '../../utils/formatters';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Flame,
  ChefHat,
  BellRing,
  Printer,
  Coffee
} from 'lucide-react';

export default function KitchenPage({ isFullscreen = false }) {
  const { orders, updateOrderStatus, voice, settings, addToast } = useCafe();
  const [filterTab, setFilterTab] = useState('Active');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [printingKot, setPrintingKot] = useState(null);

  // Update clock every 10 seconds for elapsed order timers
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter orders
  const activeOrders = orders.filter(
    o => o.status === 'Order Pending' || o.status === 'Preparing' || o.status === 'Ready'
  );

  const displayOrders = filterTab === 'Active'
    ? activeOrders
    : filterTab === 'Pending'
    ? orders.filter(o => o.status === 'Order Pending')
    : filterTab === 'Preparing'
    ? orders.filter(o => o.status === 'Preparing')
    : filterTab === 'Ready'
    ? orders.filter(o => o.status === 'Ready')
    : orders.filter(o => o.status === 'Served');

  return (
    <div className={`space-y-6 ${isFullscreen ? 'min-h-screen bg-[#1F1610] text-[#F8F5F0] p-4 sm:p-6 lg:p-8' : ''}`}>
      {/* Kitchen Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E0D5]/40 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E58A3A]">
              Live Kitchen Order Ticket (KOT Display)
            </span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isFullscreen ? 'text-white' : 'text-[#241A14]'}`}>
            किचन KOT डिस्पॅच स्क्रीन
          </h2>
        </div>

        {/* Status Pills & Voice Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className={`flex items-center rounded-2xl p-1 border shadow-sm ${
            isFullscreen ? 'bg-[#2A1E16] border-[#5C3A21]' : 'bg-white border-[#E8E0D5]'
          }`}>
            <button
              onClick={voice.toggleVoiceAlerts}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                voice.voiceEnabled
                  ? 'bg-[#E58A3A] text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {voice.voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{voice.voiceEnabled ? 'Voice Alerts Active' : 'Voice Muted'}</span>
            </button>

            <button
              onClick={voice.triggerTestVoice}
              className={`px-3 py-2 text-xs font-bold transition-colors border-l ml-1 ${
                isFullscreen
                  ? 'border-[#5C3A21] text-[#C8BAAA] hover:text-white'
                  : 'border-[#E8E0D5] text-[#8A7A6E] hover:text-[#5C3A21]'
              }`}
            >
              Test Voice
            </button>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-400 font-black text-sm border border-amber-500/30">
            {activeOrders.length} Active KOTs
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'Active', label: 'All Active KOTs', count: activeOrders.length },
          { id: 'Pending', label: 'New Orders (Pending)', count: orders.filter(o => o.status === 'Order Pending').length },
          { id: 'Preparing', label: 'Preparing (स्टोव्हवर)', count: orders.filter(o => o.status === 'Preparing').length },
          { id: 'Ready', label: 'Ready For Service (तयार)', count: orders.filter(o => o.status === 'Ready').length },
          { id: 'Served', label: 'Served (दिले)', count: orders.filter(o => o.status === 'Served').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              filterTab === tab.id
                ? 'bg-[#E58A3A] text-white border-[#E58A3A] shadow-md shadow-[#E58A3A]/25'
                : isFullscreen
                ? 'bg-[#2A1E16] text-[#C8BAAA] border-[#5C3A21] hover:text-white'
                : 'bg-white text-[#665A4F] border-[#E8E0D5] hover:bg-[#FAF7F2]'
            }`}
          >
            {tab.label} <span className="opacity-80 ml-1">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Live Order Ticket Cards Grid */}
      {displayOrders.length === 0 ? (
        <div className={`py-16 text-center rounded-3xl border ${
          isFullscreen ? 'bg-[#2A1E16]/50 border-[#5C3A21]/40 text-[#C8BAAA]' : 'bg-white border-[#E8E0D5] text-[#8A7A6E]'
        }`}>
          <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#E58A3A]" />
          <h3 className="text-base font-bold">All Kitchen KOTs Cleared!</h3>
          <p className="text-xs mt-1">टेबल QR स्कॅन करून ग्राहकाने ऑर्डर दिल्यास थेट येथे आवाज आणि KOT तिकीट येईल.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayOrders.map(order => {
            const isPending = order.status === 'Order Pending';
            const isPreparing = order.status === 'Preparing';
            const isReady = order.status === 'Ready';

            const elapsedMinutes = Math.floor(
              (currentTime - new Date(order.createdAt).getTime()) / 60000
            );
            const isUrgent = elapsedMinutes > 15;

            return (
              <div
                key={order.id}
                className={`rounded-3xl border flex flex-col justify-between transition-all shadow-md overflow-hidden ${
                  isFullscreen ? 'bg-[#2A1E16]' : 'bg-white'
                } ${
                  isUrgent
                    ? 'border-rose-500 ring-2 ring-rose-500/30'
                    : isPending
                    ? 'border-blue-400'
                    : isPreparing
                    ? 'border-orange-400'
                    : isReady
                    ? 'border-teal-400'
                    : 'border-[#E8E0D5]'
                }`}
              >
                <div>
                  {/* Card Header: Table + Time + KOT ID */}
                  <div className={`p-4 border-b flex items-start justify-between ${
                    isPending
                      ? 'bg-blue-500/10 border-blue-500/20'
                      : isPreparing
                      ? 'bg-orange-500/10 border-orange-500/20'
                      : isReady
                      ? 'bg-teal-500/10 border-teal-500/20'
                      : 'bg-gray-100/10 border-[#E8E0D5]/20'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-[#E58A3A]">
                          {order.tableName}
                        </span>
                        <span className="text-xs font-mono font-black px-2 py-0.5 rounded-lg bg-[#5C3A21] text-white">
                          {order.kotNumber || order.id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 font-medium">
                        {order.customerName || 'Guest'} {order.customerPhone ? `• ${order.customerPhone}` : ''}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg ${
                        isUrgent
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-black/20 text-gray-300'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {elapsedMinutes}m ago
                      </span>

                      <button
                        onClick={() => setPrintingKot(order)}
                        className="p-1.5 rounded-lg bg-[#FAF7F2]/20 hover:bg-[#FAF7F2]/40 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                        title="Print KOT Slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>KOT</span>
                      </button>
                    </div>
                  </div>

                  {/* KOT Ordered Items List */}
                  <div className="p-4 space-y-2.5 max-h-64 overflow-y-auto">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                          isFullscreen
                            ? 'bg-[#1F1610] border-[#5C3A21]/50'
                            : 'bg-[#FAF7F2] border-[#E8E0D5]'
                        }`}
                      >
                        <span className="w-8 h-8 rounded-xl bg-[#5C3A21] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {item.quantity}x
                        </span>

                        <div className="flex-1 min-w-0">
                          <p className={`font-black text-sm leading-tight ${isFullscreen ? 'text-white' : 'text-[#241A14]'}`}>
                            {item.name}
                          </p>

                          {item.specialInstructions ? (
                            <div className="mt-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-[11px] font-bold border border-amber-500/30 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>टीप: "{item.specialInstructions}"</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Step */}
                <div className={`p-4 border-t ${isFullscreen ? 'border-[#5C3A21]/40 bg-[#1F1610]' : 'border-[#E8E0D5] bg-[#FAF7F2]'}`}>
                  {isPending && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      className="w-full py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Accept KOT & Start Prep (स्वीकारा)</span>
                    </button>
                  )}

                  {isPreparing && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Ready')}
                      className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Ready (ऑर्डर तयार झाली)</span>
                    </button>
                  )}

                  {isReady && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Served')}
                      className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>Mark Served (टेबलवर दिली)</span>
                    </button>
                  )}

                  {!isPending && !isPreparing && !isReady && (
                    <div className="text-center py-1 text-xs font-semibold text-emerald-500 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>KOT Completed / Served</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Thermal KOT Slip Modal */}
      {printingKot && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl border border-[#E8E0D5] relative text-center">
            <button
              onClick={() => setPrintingKot(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#F8F5F0] text-[#665A4F] flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>

            {/* Thermal KOT Ticket */}
            <div className="printable-area p-4 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#8A7A6E] font-mono text-xs text-left space-y-2 mb-4">
              <div className="text-center border-b border-dashed border-[#8A7A6E] pb-2">
                <h4 className="font-black text-sm uppercase">KITCHEN ORDER TICKET (KOT)</h4>
                <p className="font-bold text-xs text-[#5C3A21]">{settings.cafeName}</p>
              </div>

              <div className="flex justify-between font-black text-sm border-b border-dashed border-[#8A7A6E] pb-1">
                <span>{printingKot.tableName}</span>
                <span>{printingKot.kotNumber || printingKot.id}</span>
              </div>

              <div className="text-[10px] text-[#8A7A6E]">
                Time: {formatDateTime(printingKot.createdAt)}
              </div>

              <div className="border-t border-b border-dashed border-[#8A7A6E] py-2 space-y-1.5">
                {printingKot.items.map((it, i) => (
                  <div key={i} className="flex items-start justify-between">
                    <span className="font-black text-sm w-8">{it.quantity}x</span>
                    <div className="flex-1">
                      <p className="font-bold text-xs">{it.name}</p>
                      {it.specialInstructions && (
                        <p className="text-[10px] text-amber-700 font-sans italic">Note: "{it.specialInstructions}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-center text-[#8A7A6E] pt-1">
                Customer: {printingKot.customerName || 'Walk-in'}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-[#5C3A21] text-white text-xs font-bold hover:bg-[#4B2E19] flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print KOT</span>
              </button>
              <button
                onClick={() => setPrintingKot(null)}
                className="py-2 px-3 rounded-xl bg-gray-100 text-[#241A14] text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
