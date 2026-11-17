import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Printer,
  X,
  Share2,
  CheckCircle2,
  Coffee,
  IndianRupee,
  Clock,
  UtensilsCrossed
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function ThermalReceiptModal({
  isOpen,
  onClose,
  order,
  settings = {},
  type = 'bill' // 'bill' | 'kot'
}) {
  if (!isOpen || !order) return null;

  const isKot = type === 'kot';
  const cafeName = settings.cafeName || 'The 7 Cafe';
  const phone = order.customerPhone || '';

  // Generate WhatsApp message content
  const handleShareWhatsApp = () => {
    const itemsText = order.items
      .map(i => `• ${i.quantity}x ${i.name} - ${formatCurrency(i.price * i.quantity)}`)
      .join('\n');

    const msg = `☕ *${cafeName.toUpperCase()} - TAX INVOICE*\n` +
      `Table: *${order.tableName}* | Bill: *${order.id}*\n` +
      `Date: ${formatDateTime(order.createdAt)}\n` +
      `--------------------------------\n` +
      `${itemsText}\n` +
      `--------------------------------\n` +
      `Subtotal: ${formatCurrency(order.subtotal)}\n` +
      `GST (${settings.gstPercentage || 5}%): ${formatCurrency(order.gst)}\n` +
      (order.discount ? `Discount: -${formatCurrency(order.discount)}\n` : '') +
      `*Total Paid: ${formatCurrency(order.total)}* (${order.paymentMethod || 'UPI'})\n\n` +
      `Thank you for visiting ${cafeName}! Visit again. ✨`;

    const cleanPhone = phone.replace(/\D/g, '');
    const url = cleanPhone.length === 10
      ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;

    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  // UPI payment QR string
  const upiQrString = `upi://pay?pa=the7cafe@okhdfcbank&pn=${encodeURIComponent(cafeName)}&am=${order.total}&cu=INR&tn=Bill-${order.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#E8E0D5]">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-[#FAF7F2] border-b border-[#E8E0D5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#5C3A21] text-white">
              <Printer className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-xs text-[#241A14]">
                {isKot ? 'Kitchen Order Ticket (KOT Slip)' : 'Thermal Tax Invoice (58/80mm)'}
              </h3>
              <p className="text-[10px] text-[#8A7A6E]">Ready for ESC/POS Thermal Printers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#E8E0D5] flex items-center justify-center text-[#5C3A21] shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Receipt Preview (Printable Area) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FBFBFA]">
          <div className="printable-area bg-white p-5 rounded-2xl border border-dashed border-gray-300 shadow-sm font-mono text-xs text-black max-w-[320px] mx-auto leading-relaxed">
            {isKot ? (
              /* KITCHEN KOT SLIP FORMAT */
              <div className="text-center space-y-2">
                <div className="border-b-2 border-black pb-2">
                  <h2 className="text-xl font-black uppercase tracking-wider">
                    *** KITCHEN TICKET ***
                  </h2>
                  <p className="text-sm font-extrabold mt-1">
                    {order.tableName?.toUpperCase()} {order.round ? `(ROUND ${order.round})` : ''}
                  </p>
                </div>

                <div className="flex justify-between text-[11px] py-1 border-b border-black">
                  <span>KOT: {order.kotNumber || order.id}</span>
                  <span>{formatDateTime(order.createdAt)}</span>
                </div>

                {/* Items List */}
                <div className="text-left py-2 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="border-b border-dashed border-gray-300 pb-2">
                      <div className="flex items-start justify-between font-black text-sm">
                        <span className="w-6 text-base font-black">[{item.quantity}]</span>
                        <span className="flex-1 uppercase">{item.name}</span>
                      </div>
                      {item.specialInstructions && (
                        <div className="ml-6 text-[10px] font-bold text-gray-700 italic">
                          &gt;&gt; NOTE: {item.specialInstructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-black pt-2 text-center text-[10px] font-bold uppercase">
                  Total Items: {order.items.reduce((s, i) => s + i.quantity, 0)} • KOT Generated
                </div>
              </div>
            ) : (
              /* CUSTOMER THERMAL TAX BILL FORMAT */
              <div className="space-y-3">
                {/* Header */}
                <div className="text-center space-y-1">
                  <h2 className="text-base font-black uppercase tracking-widest">
                    {cafeName.toUpperCase()}
                  </h2>
                  <p className="text-[10px] text-gray-600">
                    {settings.address || 'Shop No. 1, Main Road, Maharashtra'}
                  </p>
                  <p className="text-[10px] text-gray-600">
                    Tel: {settings.phone || '+91 98765 43210'}
                  </p>
                  {settings.gstNumber && (
                    <p className="text-[9px] font-bold text-gray-700">
                      GSTIN: {settings.gstNumber}
                    </p>
                  )}
                  <div className="border-b border-dashed border-gray-400 pt-1" />
                  <p className="text-[10px] font-bold tracking-wider uppercase py-0.5">
                    *** RETAIL INVOICE ***
                  </p>
                  <div className="border-b border-dashed border-gray-400" />
                </div>

                {/* Metadata */}
                <div className="flex justify-between text-[10px] pt-1">
                  <div>
                    <div>Bill No: <span className="font-bold">{order.id}</span></div>
                    <div>Table: <span className="font-bold">{order.tableName}</span></div>
                  </div>
                  <div className="text-right">
                    <div>Date: {formatDateTime(order.createdAt)}</div>
                    <div>Guest: {order.customerName || 'Walk-in'}</div>
                  </div>
                </div>

                <div className="border-b border-black" />

                {/* Table Header */}
                <div className="grid grid-cols-12 text-[10px] font-bold uppercase pb-1 border-b border-gray-300">
                  <span className="col-span-6">Item</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-2 text-right">Rate</span>
                  <span className="col-span-2 text-right">Amt</span>
                </div>

                {/* Items */}
                <div className="space-y-1 py-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 text-[10px] items-start">
                      <span className="col-span-6 font-bold leading-tight">{item.name}</span>
                      <span className="col-span-2 text-center">{item.quantity}</span>
                      <span className="col-span-2 text-right">{item.price}</span>
                      <span className="col-span-2 text-right font-bold">
                        {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-b border-dashed border-gray-400 pt-1" />

                {/* Financial Summary */}
                <div className="space-y-1 text-[11px] pt-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>CGST ({(settings.gstPercentage || 5) / 2}%):</span>
                    <span>{formatCurrency(order.gst / 2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>SGST ({(settings.gstPercentage || 5) / 2}%):</span>
                    <span>{formatCurrency(order.gst / 2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between font-bold text-gray-800">
                      <span>Discount:</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-b-2 border-black pt-1" />
                  <div className="flex justify-between text-sm font-black pt-1">
                    <span>NET PAYABLE:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold pt-0.5">
                    <span>Payment Mode:</span>
                    <span className="uppercase">{order.paymentMethod || 'UPI / Cash'}</span>
                  </div>
                </div>

                {/* Bottom UPI QR for scan & pay */}
                <div className="text-center pt-3 space-y-1.5 flex flex-col items-center">
                  <div className="p-1.5 bg-white border border-gray-300 rounded-lg inline-block">
                    <QRCodeSVG value={upiQrString} size={84} level="M" />
                  </div>
                  <p className="text-[9px] font-bold text-gray-700">
                    Scan via PhonePe / GPay / Paytm
                  </p>
                </div>

                {/* Footer Message */}
                <div className="text-center text-[10px] pt-2 border-t border-dashed border-gray-400 space-y-0.5">
                  <p className="font-bold">*** THANK YOU! VISIT AGAIN ***</p>
                  <p className="text-[8px] text-gray-500">Powering The 7 Cafe Smart POS</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-white border-t border-[#E8E0D5] flex items-center justify-between gap-3 shrink-0">
          {!isKot && (
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Send WhatsApp</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white font-extrabold text-xs shadow-md shadow-[#5C3A21]/20 flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
