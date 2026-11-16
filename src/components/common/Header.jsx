import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { useAuth } from '../../context/AuthContext';
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
  ChevronDown
} from 'lucide-react';

export default function Header({ toggleMobileSidebar }) {
  const { settings, stats, voice, resetDemoData, triggerTestVoice } = useCafe();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#F8F5F0]/90 backdrop-blur-md border-b border-[#E8E0D5] px-4 lg:px-8 py-3 flex items-center justify-between">
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
            {stats.activeTablesCount} / {settings.tableCount || 12} Tables Active
          </span>
        </div>
      </div>

      {/* Right actions: Voice toggle, voice test, quick POS, QR menu preview, demo reset, user profile */}
      <div className="flex items-center gap-2 sm:gap-3">
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

        {/* Customer Menu Link (Quick preview of QR experience) */}
        <Link
          to="/menu?table=Table%2004"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] rounded-xl text-xs font-medium transition-all shadow-sm"
          title="Preview what a customer sees when scanning QR code at Table 04"
        >
          <QrCode className="w-3.5 h-3.5 text-[#E58A3A]" />
          <span>Customer QR Menu</span>
        </Link>

        {/* Kitchen Screen link */}
        <Link
          to="/kitchen"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] rounded-xl text-xs font-medium transition-all shadow-sm"
          title="Open Dedicated Fullscreen Kitchen Display System"
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
                <p className="text-xs text-[#8A7A6E] truncate">{user?.email || 'admin@cafeflow.com'}</p>
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
  );
}
