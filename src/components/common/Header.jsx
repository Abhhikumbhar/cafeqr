import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatTimeAgo } from '../../utils/formatters';
import {
  Volume2,
  VolumeX,
  Sparkles,
  QrCode,
  UtensilsCrossed,
  RotateCcw,
  LogOut,
  Menu as MenuIcon,
  ShoppingBag,
  Bell,
  Coffee,
  ChevronDown,
  X,
  ArrowRight,
  Clock,
  Eye
} from 'lucide-react';

export default function Header({ toggleMobileSidebar }) {
  const { settings, stats, orders, voice, resetDemoData, triggerTestVoice } = useCafe();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dismissedOrderId, setDismissedOrderId] = useState(null);

  // Active orders awaiting kitchen / billing
  const activeOrders = orders.filter(
    o => o.status === 'Order Pending' || o.status === 'Preparing' || o.status === 'Ready'
  );

  // Most recent pending order for immediate top alert
  const latestPending = orders.find(
    o => (o.status === 'Order Pending' || o.status === 'Preparing') && o.id !== dismissedOrderId
  );

  return (
    <div className="sticky top-0 z-30">
      {/* 1. Live Instant Order Alert Banner (Direct to Admin & Kitchen) */}
      {latestPending && (
        <div className="bg-gradient-to-r from-[#D97724] via-[#C96B1C] to-[#8C4312] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold shadow-md animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <p className="truncate">
              <span className="text-amber-200 uppercase tracking-wide mr-1.5 font-black">
                [LIVE ORDER]
              </span>
              <span>{latestPending.tableName} वरून {latestPending.kotNumber} ऑर्डर आली!</span>
              <span className="text-amber-100 font-normal ml-1.5 hidden sm:inline">
                ({latestPending.items.map(i => `${i.quantity}x ${i.name}`).join(', ')})
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            <Link
              to="/admin/kitchen"
              className="px-3 py-1 rounded-xl bg-white text-[#5C3A21] hover:bg-amber-100 font-extrabold text-[11px] shadow-sm flex items-center gap-1 transition-all"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#E58A3A]" />
              <span>किचन KOT उघडा</span>
            </Link>
            <Link
              to="/admin/pos"
              className="hidden sm:flex px-2.5 py-1 rounded-xl bg-black/25 hover:bg-black/40 text-white font-semibold text-[11px] transition-all"
            >
              <span>POS बिल</span>
            </Link>
            <button
              onClick={() => setDismissedOrderId(latestPending.id)}
              className="p-1 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Header */}
      <header className="bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#E8E0D5] px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Left section: mobile hamburger & title info */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-[#5C3A21] hover:bg-[#E8E0D5]/50 transition-colors"
            title="Toggle Navigation"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-[#5C3A21] uppercase tracking-wider">
              Live Cafe Stream
            </span>
            <span className="text-xs text-[#8A7A6E]">|</span>
            <span className="text-xs text-[#665A4F] font-medium">
              {stats.activeTablesCount} / {settings.tableCount || 10} Tables Active
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Incoming Orders Bell Notification */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl bg-white border border-[#E8E0D5] hover:bg-gray-50 text-[#5C3A21] transition-all shadow-xs"
              title="Incoming Live Orders"
            >
              <Bell className="w-4 h-4 text-[#5C3A21]" />
              {activeOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {activeOrders.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#E8E0D5] p-3 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setNotifOpen(false)}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E0D5]">
                  <h4 className="font-extrabold text-xs text-[#241A14] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Live Customer Orders ({activeOrders.length})</span>
                  </h4>
                  <Link
                    to="/admin/kitchen"
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] font-bold text-[#E58A3A] hover:underline"
                  >
                    View All in KOT ➔
                  </Link>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {activeOrders.length === 0 ? (
                    <div className="py-6 text-center text-[#8A7A6E] text-xs">
                      No active pending orders right now.
                    </div>
                  ) : (
                    activeOrders.slice(0, 5).map(ord => (
                      <div
                        key={ord.id}
                        className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] hover:border-[#D97724] transition-all"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-xs text-[#241A14]">
                            {ord.tableName} • {ord.kotNumber || ord.id}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#665A4F] truncate">
                          {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E8E0D5]/60 text-[11px]">
                          <span className="font-extrabold text-[#5C3A21]">
                            {formatCurrency(ord.total)}
                          </span>
                          <div className="flex items-center gap-2">
                            <Link
                              to="/admin/kitchen"
                              onClick={() => setNotifOpen(false)}
                              className="font-bold text-[#D97724] hover:underline"
                            >
                              Kitchen KOT
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link
                              to="/admin/pos"
                              onClick={() => setNotifOpen(false)}
                              className="font-bold text-[#5C3A21] hover:underline"
                            >
                              POS Bill
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Voice Alert Pill & Quick Test */}
          <div className="flex items-center bg-white border border-[#E8E0D5] rounded-xl p-1 shadow-sm">
            <button
              onClick={voice.toggleVoiceAlerts}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                voice.voiceEnabled
                  ? 'bg-amber-100/80 text-[#5C3A21] hover:bg-amber-200/80'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title={voice.voiceEnabled ? 'Click to Mute Voice Alerts' : 'Click to Enable Voice Alerts'}
            >
              {voice.voiceEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#E58A3A]" />
                  <span className="hidden md:inline font-semibold">Voice On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                  <span className="hidden md:inline">Voice Muted</span>
                </>
              )}
            </button>

            <button
              onClick={triggerTestVoice}
              className="px-2 py-1.5 text-xs text-[#8A7A6E] hover:text-[#5C3A21] hover:bg-[#F8F5F0] rounded-lg transition-colors border-l border-[#E8E0D5] ml-1 flex items-center gap-1"
              title="Test Voice Announcement"
            >
              <Sparkles className="w-3 h-3 text-[#E58A3A]" />
              <span className="hidden sm:inline">Test</span>
            </button>
          </div>

          {/* Customer Menu Link */}
          <Link
            to="/menu?table=Table%2001"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] rounded-xl text-xs font-medium transition-all shadow-sm"
            title="Preview Customer QR Menu"
          >
            <QrCode className="w-3.5 h-3.5 text-[#E58A3A]" />
            <span>Customer QR Menu</span>
          </Link>

          {/* Kitchen Screen link */}
          <Link
            to="/admin/kitchen"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] rounded-xl text-xs font-medium transition-all shadow-sm"
            title="Open Kitchen Display System"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#E58A3A]" />
            <span>Kitchen KDS</span>
          </Link>

          {/* POS Quick Button */}
          <Link
            to="/admin/pos"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E58A3A] hover:bg-[#D77A28] text-white rounded-xl text-xs font-semibold shadow-sm shadow-[#E58A3A]/20 transition-all transform active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>New Order (POS)</span>
          </Link>

          {/* Reset / Clear Data button */}
          <button
            onClick={() => {
              if (window.confirm('Clear all orders, tables, and customers to starting state?')) {
                resetDemoData();
              }
            }}
            className="p-2 text-[#8A7A6E] hover:text-[#5C3A21] hover:bg-white rounded-xl border border-transparent hover:border-[#E8E0D5] transition-all"
            title="Reset System Data (Clean Starting State)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-white border border-transparent hover:border-[#E8E0D5] transition-all"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover border border-[#5C3A21]/30"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#5C3A21]" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8E0D5] py-2 z-50 animate-fade-in"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b border-[#E8E0D5]/60">
                  <p className="text-sm font-semibold text-[#241A14]">{user?.name || 'Administrator'}</p>
                  <p className="text-xs text-[#8A7A6E] truncate">{user?.email || 'admin@the7cafe.com'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-[#5C3A21] text-[10px] font-bold rounded-full">
                    {user?.role || 'Admin'}
                  </span>
                </div>

                <div className="p-1">
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#665A4F] hover:text-[#241A14] hover:bg-[#F8F5F0] rounded-xl transition-colors"
                  >
                    <Coffee className="w-4 h-4 text-[#5C3A21]" />
                    <span>Cafe Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate('/admin/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
