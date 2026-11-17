import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import {
  Settings,
  Coffee,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Save,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Percent,
  CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, setSettings, voice, resetDemoData, addToast } = useCafe();
  const [form, setForm] = useState({ ...settings });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(prev => ({
      ...prev,
      ...form,
      gstPercentage: Number(form.gstPercentage) || 5,
      tableCount: Number(form.tableCount) || 12,
      fifthVisitDiscount: Number(form.fifthVisitDiscount) || 50,
      minOrderForLoyalty: Number(form.minOrderForLoyalty) || 150
    }));
    addToast('Cafe configuration saved successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241A14] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#5C3A21]" />
            The 7 Cafe System Settings
          </h2>
          <p className="text-xs text-[#8A7A6E]">
            Brand information, tax rates, voice speech preferences, and loyalty program rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cafe Profile Section */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-[#241A14] flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#E58A3A]" />
            Cafe Identity & Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#665A4F] block mb-1">
                Cafe Name *
              </label>
              <input
                type="text"
                name="cafeName"
                value={form.cafeName}
                onChange={handleChange}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#665A4F] block mb-1">
                Tagline / Concept
              </label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#665A4F] block mb-1">
                Physical Address (Printed on Receipts)
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#665A4F] block mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#665A4F] block mb-1">
                GST / Tax Registration Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={form.gstNumber}
                onChange={handleChange}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>
          </div>
        </div>

        {/* Financial & Tax Configurations */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-[#241A14] flex items-center gap-2">
            <Percent className="w-5 h-5 text-[#5C3A21]" />
            Taxation & Table Scale
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#665A4F] block mb-1">
                GST Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="gstPercentage"
                value={form.gstPercentage}
                onChange={handleChange}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#665A4F] block mb-1">
                Total Seating Tables Count
              </label>
              <input
                type="number"
                name="tableCount"
                value={form.tableCount}
                onChange={handleChange}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#665A4F] block mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>
          </div>
        </div>

        {/* Voice Announcement Engine Settings */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#241A14] flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#E58A3A]" />
              Voice Announcement Engine (SpeechSynthesis API)
            </h3>
            <button
              type="button"
              onClick={voice.triggerTestVoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-[#5C3A21] border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E58A3A]" />
              <span>Test Audio Alert</span>
            </button>
          </div>

          <p className="text-xs text-[#8A7A6E]">
            Automatically announces live orders to Kitchen and Admin with table number and ordered items.
          </p>

          <div className="space-y-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="voiceEnabled"
                checked={form.voiceEnabled}
                onChange={handleChange}
                className="w-5 h-5 rounded text-[#E58A3A] focus:ring-[#E58A3A]"
              />
              <span className="text-xs font-bold text-[#241A14]">
                Enable Speech Synthesis announcements for new customer orders
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#665A4F] block mb-1">
                  Speech Cadence / Rate ({form.voiceRate || 1.0}x)
                </label>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.05"
                  name="voiceRate"
                  value={form.voiceRate || 1.0}
                  onChange={handleChange}
                  className="w-full accent-[#E58A3A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#665A4F] block mb-1">
                  Volume Level ({Math.round((form.voiceVolume || 1.0) * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.1"
                  name="voiceVolume"
                  value={form.voiceVolume || 1.0}
                  onChange={handleChange}
                  className="w-full accent-[#E58A3A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Cloud Sync (Mobile to Laptop) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#241A14] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E58A3A]" />
              Real-time Cloud Sync (मोबाईल ते लॅपटॉप लाईव्ह सिंक)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
              Active Bridge
            </span>
          </div>

          <p className="text-xs text-[#8A7A6E]">
            ग्राहकाने कोणत्याही मोबाईलवरून टेबल QR स्कॅन करून ऑर्डर दिली की ती इंटरनेटद्वारे थेट तुमच्या लॅपटॉपच्या किचन KOT स्क्रीनवर येण्यासाठी हा चॅनेल वापरला जातो.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-xs font-bold text-[#665A4F] block mb-1">
                Cloud Sync Channel Name
              </label>
              <input
                type="text"
                name="cloudSyncChannel"
                value={form.cloudSyncChannel || 'the_7_cafe_kot_prod'}
                onChange={handleChange}
                placeholder="the_7_cafe_kot_prod"
                className="w-full text-xs font-mono py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#665A4F] block mb-1">
                Permanent Live Website Domain (for Table QRs)
              </label>
              <input
                type="url"
                name="qrBaseUrl"
                value={form.qrBaseUrl || ''}
                onChange={handleChange}
                placeholder="https://cafeqr.vercel.app"
                className="w-full text-xs font-mono py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>
          </div>
        </div>

        {/* Firebase Cloud Database & Analytics */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#241A14] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Firebase Cloud Database & Analytics
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected (the7cafe)
            </span>
          </div>

          <p className="text-xs text-[#8A7A6E]">
            Google Firebase Firestore is connected and actively storing orders, live customer tracking, and real-time syncing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E0D5] font-mono">
            <div>
              <span className="text-[#8A7A6E] block text-[10px] uppercase font-bold">Project ID</span>
              <span className="font-bold text-[#241A14]">the7cafe</span>
            </div>
            <div>
              <span className="text-[#8A7A6E] block text-[10px] uppercase font-bold">Auth Domain</span>
              <span className="font-bold text-[#241A14]">the7cafe.firebaseapp.com</span>
            </div>
            <div>
              <span className="text-[#8A7A6E] block text-[10px] uppercase font-bold">Storage Bucket</span>
              <span className="font-bold text-[#241A14]">the7cafe.firebasestorage.app</span>
            </div>
            <div>
              <span className="text-[#8A7A6E] block text-[10px] uppercase font-bold">Measurement ID</span>
              <span className="font-bold text-[#241A14]">G-PJQ1WY3HXL</span>
            </div>
          </div>
        </div>

        {/* System Data Reset */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#E8E0D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-sm text-[#241A14]">
              Data Storage & Reset
            </h4>
            <p className="text-xs text-[#8A7A6E] mt-0.5">
              Clear all orders, table tickets, and customer records to start fresh.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all orders and reset tables to fresh starting state?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#E8E0D5] text-[#5C3A21] hover:bg-gray-50 text-xs font-bold shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear / Reset Data</span>
          </button>
        </div>
      </form>
    </div>
  );
}
