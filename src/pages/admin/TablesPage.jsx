import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, STATUS_COLORS } from '../../utils/formatters';
import {
  Grid3X3,
  QrCode,
  Users,
  Printer,
  RotateCcw,
  Plus,
  Eye,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Sparkles,
  Link2,
  Check
} from 'lucide-react';

export default function TablesPage() {
  const { tables, orders, updateTableStatus, resetTable, addTable, editTable, settings, setSettings, addToast } = useCafe();
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTableForQR, setSelectedTableForQR] = useState(null);
  const [showPrintAllModal, setShowPrintAllModal] = useState(false);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState(null);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [customQrDomain, setCustomQrDomain] = useState(settings.qrBaseUrl || '');

  // 10 Tables status categories
  const statuses = [
    'All',
    'Available',
    'Occupied',
    'Order Pending',
    'Preparing',
    'Ready',
    'Served',
    'Billing'
  ];

  const filteredTables = filterStatus === 'All'
    ? tables
    : tables.filter(t => t.status === filterStatus);

  // Helper to find the active order for a table
  const getActiveOrder = (table) => {
    if (!table.activeOrderId) return null;
    return orders.find(o => o.id === table.activeOrderId && o.status !== 'Completed');
  };

  // Helper to get permanent QR link URL for a table
  const getTableQRUrl = (tableName) => {
    // If a custom production domain is saved, use it; otherwise use current origin
    const base = customQrDomain.trim() || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');
    const cleanBase = base.replace(/\/+$/, '');
    return `${cleanBase}/menu?table=${encodeURIComponent(tableName)}`;
  };

  const handleSaveDomain = () => {
    setSettings(prev => ({ ...prev, qrBaseUrl: customQrDomain.trim() }));
    addToast('Live QR Domain saved! QR codes will now use this permanent URL.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
              Permanent QR System
            </span>
            <span className="text-xs text-[#8A7A6E]">10 Cafe Tables</span>
          </div>
          <h2 className="text-2xl font-black text-[#241A14] flex items-center gap-2">
            <Grid3X3 className="w-6 h-6 text-[#5C3A21]" />
            Table Management (10 Tables)
          </h2>
          <p className="text-xs text-[#8A7A6E]">
            Print once and place on dining tables. Scanning auto-detects the table number and sends orders directly to the Kitchen KOT.
          </p>
        </div>

        {/* Top Actions: Print All 10 QRs + Add Table */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowPrintAllModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E58A3A] hover:bg-[#D77A28] text-white text-xs font-black shadow-md shadow-[#E58A3A]/25 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print All 10 Tables Sheet</span>
          </button>

          <button
            onClick={() => setShowAddTableModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-[#E8E0D5] hover:bg-[#FAF7F2] text-[#5C3A21] text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </button>
        </div>
      </div>

      {/* Permanent Live Domain Configuration Card */}
      <div className="bg-[#FAF7F2] p-4 rounded-3xl border border-[#E8E0D5] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Link2 className="w-5 h-5 text-[#E58A3A] shrink-0" />
          <div>
            <h4 className="text-xs font-extrabold text-[#241A14]">
              Permanent Table QR Website URL (Live Domain)
            </h4>
            <p className="text-[11px] text-[#8A7A6E]">
              This live link is encoded into the permanent QR codes so customers open your digital menu when scanning.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="url"
            value={customQrDomain}
            onChange={(e) => setCustomQrDomain(e.target.value)}
            placeholder={typeof window !== 'undefined' ? window.location.origin : 'https://cafeqr.vercel.app'}
            className="text-xs font-mono py-2 px-3 rounded-xl bg-white border border-[#E8E0D5] text-[#241A14] flex-1 md:w-64"
          />
          <button
            onClick={handleSaveDomain}
            className="px-3.5 py-2 rounded-xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-xs font-bold shrink-0 transition-colors"
          >
            Save URL
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statuses.map(st => {
          const count = st === 'All' ? tables.length : tables.filter(t => t.status === st).length;
          const isActive = filterStatus === st;

          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-sm'
                  : 'bg-white text-[#665A4F] border-[#E8E0D5] hover:bg-[#FAF7F2]'
              }`}
            >
              {st} <span className="opacity-70 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 10 Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredTables.map(table => {
          const activeOrder = getActiveOrder(table);
          const statusStyle = STATUS_COLORS[table.status] || STATUS_COLORS.Available;
          const isOccupied = table.status !== 'Available';
          const qrUrl = getTableQRUrl(table.name);

          return (
            <div
              key={table.id}
              className={`bg-white rounded-3xl p-4 border transition-all hover:shadow-md flex flex-col justify-between ${
                isOccupied ? 'border-[#5C3A21]/30 shadow-sm' : 'border-[#E8E0D5]'
              }`}
            >
              <div>
                {/* Table Header: Name + Capacity + Status Pill */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-black text-[#241A14]">
                      {table.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-[#8A7A6E]">
                      <Users className="w-3 h-3" />
                      <span>{table.capacity} Seater</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {table.status}
                  </span>
                </div>

                {/* Table QR Thumbnail */}
                <div
                  onClick={() => setSelectedTableForQR(table)}
                  className="bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#E8E0D5] text-center my-3 cursor-pointer hover:bg-white transition-colors group"
                >
                  <div className="bg-white p-2 rounded-xl inline-block border border-[#E8E0D5] shadow-xs group-hover:scale-105 transition-transform">
                    <QRCodeSVG
                      value={qrUrl}
                      size={95}
                      level="M"
                      includeMargin={false}
                      bgColor="#FFFFFF"
                      fgColor="#241A14"
                    />
                  </div>
                  <p className="text-[10px] font-extrabold text-[#5C3A21] mt-1.5 flex items-center justify-center gap-1">
                    <QrCode className="w-3 h-3 text-[#E58A3A]" />
                    <span>Permanent QR Code</span>
                  </p>
                </div>

                {/* Active Order Card info or Available State */}
                {activeOrder ? (
                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 mb-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#5C3A21]">
                        {activeOrder.kotNumber || activeOrder.id}
                      </span>
                      <span className="font-extrabold text-[#241A14]">
                        {formatCurrency(activeOrder.total)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#665A4F] truncate font-medium">
                      {activeOrder.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-50/50 border border-emerald-100 p-2 rounded-xl text-center mb-3">
                    <p className="text-[11px] font-semibold text-emerald-800">
                      Table Ready for Guests
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Print QR, Reset Table */}
              <div className="pt-2.5 border-t border-[#E8E0D5]/70 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setSelectedTableForQR(table)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] text-[11px] font-bold transition-colors"
                  title="Print Permanent Standee"
                >
                  <Printer className="w-3 h-3 text-[#E58A3A]" />
                  <span>Print QR</span>
                </button>

                {table.status !== 'Available' && (
                  <button
                    onClick={() => resetTable(table.id)}
                    className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#5C3A21] border border-amber-200 transition-colors"
                    title="Reset to Available"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SINGLE TABLE QR MODAL */}
      {selectedTableForQR && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E8E0D5] relative text-center">
            <button
              onClick={() => setSelectedTableForQR(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] hover:text-[#241A14] flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            {/* Printable Single Table QR Stand Card */}
            <div className="printable-area p-6 bg-gradient-to-b from-[#FAF7F2] to-white rounded-3xl border border-[#E8E0D5] shadow-inner mb-4">
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <Coffee className="w-5 h-5 text-[#E58A3A]" />
                <span className="font-aesthetic-serif italic font-extrabold text-xl tracking-wider text-[#241A14]">
                  {settings.cafeName || 'The 7 Cafe'}
                </span>
              </div>
              <p className="font-aesthetic-cursive text-sm text-[#75553E] font-bold tracking-wide mb-2">
                ~ coffee & conversations ~
              </p>
              <p className="text-[11px] text-[#8A7A6E] mb-3">
                Scan to browse menu & order directly
              </p>

              {/* The SVG QR Code */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E0D5] inline-block shadow-sm">
                <QRCodeSVG
                  value={getTableQRUrl(selectedTableForQR.name)}
                  size={180}
                  level="H"
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#241A14"
                />
              </div>

              <div className="mt-3">
                <div className="inline-block px-5 py-1.5 rounded-full bg-[#5C3A21] text-white font-black text-base tracking-wide">
                  {selectedTableForQR.name}
                </div>
                <p className="text-[10px] font-bold text-[#E58A3A] mt-2">
                  Direct Kitchen KOT Dispatch • Permanent QR
                </p>
                <p className="text-[9px] text-[#8A7A6E] mt-0.5 break-all max-w-xs mx-auto">
                  {getTableQRUrl(selectedTableForQR.name)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-xs font-bold shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Table Standee</span>
              </button>

              <a
                href={getTableQRUrl(selectedTableForQR.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] text-xs font-bold transition-all"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#E58A3A]" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ALL 10 TABLES PRINTABLE SHEET MODAL */}
      {showPrintAllModal && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-[#E8E0D5] relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3 mb-4">
              <div>
                <h3 className="text-lg font-black text-[#241A14] flex items-center gap-2">
                  <Printer className="w-5 h-5 text-[#E58A3A]" />
                  Print All 10 Table QR Standees
                </h3>
                <p className="text-xs text-[#8A7A6E]">
                  Print once, cut along borders, and place into table acrylic standees.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5C3A21] text-white text-xs font-black hover:bg-[#4B2E19] shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Sheet Now</span>
                </button>
                <button
                  onClick={() => setShowPrintAllModal(false)}
                  className="w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* The 10-Table Printable Grid */}
            <div className="printable-area grid grid-cols-2 md:grid-cols-3 gap-4 p-2 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D5]">
              {tables.slice(0, 10).map(t => (
                <div
                  key={t.id}
                  className="bg-white p-4 rounded-2xl border border-[#E8E0D5] text-center shadow-xs flex flex-col items-center justify-between"
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Coffee className="w-4 h-4 text-[#E58A3A]" />
                    <span className="font-aesthetic-serif italic font-extrabold text-sm tracking-wide text-[#241A14]">
                      {settings.cafeName || 'The 7 Cafe'}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#8A7A6E] mb-2 font-medium">
                    Scan to Browse & Order
                  </p>

                  <div className="bg-white p-2 rounded-xl border border-[#E8E0D5] inline-block shadow-inner mb-2">
                    <QRCodeSVG
                      value={getTableQRUrl(t.name)}
                      size={130}
                      level="H"
                      includeMargin={true}
                      bgColor="#FFFFFF"
                      fgColor="#241A14"
                    />
                  </div>

                  <div className="px-4 py-1 rounded-full bg-[#5C3A21] text-white font-black text-sm tracking-wide">
                    {t.name}
                  </div>

                  <p className="text-[9px] font-bold text-[#E58A3A] mt-1.5">
                    Direct Kitchen KOT System
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#E58A3A] hover:bg-[#D77A28] text-white text-xs font-black shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print All 10 Table Cards</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E8E0D5]">
            <h3 className="text-lg font-bold text-[#241A14] mb-3">Add Table</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#665A4F] block mb-1">
                  Table Number
                </label>
                <input
                  type="text"
                  disabled
                  value={`Table ${String(tables.length + 1).padStart(2, '0')}`}
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-[#F8F5F0] border border-[#E8E0D5] text-[#8A7A6E]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#665A4F] block mb-1">
                  Seating Capacity (Guests)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-[#E8E0D5] text-[#241A14]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddTableModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#665A4F] hover:bg-[#F8F5F0]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addTable({ capacity: newTableCapacity });
                    setShowAddTableModal(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5C3A21] text-white hover:bg-[#4B2E19]"
                >
                  Create Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
