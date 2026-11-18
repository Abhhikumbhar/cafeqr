import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import LoyaltyPunchCard from '../../components/common/LoyaltyPunchCard';
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
  QrCode
} from 'lucide-react';

export default function CustomerOrderTrackingPage() {
  const { orderId } = useParams();
  const { orders, updateOrderStatus, getCustomerByPhone, settings, addToast } = useCafe();

  // Find order
  const order = orders.find(o => o.id === orderId) || orders[0];
  const matchedCustomer = order?.customerPhone ? getCustomerByPhone(order.customerPhone) : null;

  const steps = [
    { key: 'Order Pending', label: 'Order Received', desc: 'Dispatched to barista & kitchen', icon: Clock },
    { key: 'Preparing', label: 'Crafting in Kitchen', desc: 'Fresh ingredients being prepared', icon: Flame },
    { key: 'Ready', label: 'Food Ready', desc: 'Plated and ready to be served', icon: UtensilsCrossed },
    { key: 'Served', label: 'Served to Table', desc: 'Enjoy your meal!', icon: CheckCircle2 }
  ];

  const getStepIndex = (status) => {
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

  const currentStepIdx = getStepIndex(order?.status);

  const handleCallStaff = () => {
    addToast('Ding! Server notified for your table.', 'success');
  };

  const handleRequestBill = () => {
    if (order) {
      updateOrderStatus(order.id, 'Billing');
      addToast('Bill requested! Staff is printing your invoice.', 'info');
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold text-[#8A7A6E]">Order not found</p>
          <Link
            to="/menu"
            className="px-4 py-2 rounded-xl bg-[#5C3A21] text-white text-xs font-bold"
          >
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#241A14] flex flex-col font-sans p-4 sm:p-6 max-w-xl mx-auto w-full space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/menu?table=${encodeURIComponent(order.tableName)}`}
          className="flex items-center gap-1.5 text-xs font-bold text-[#5C3A21] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Menu</span>
        </Link>

        <span className="px-3 py-1 rounded-full bg-[#5C3A21] text-white text-xs font-extrabold">
          {order.tableName}
        </span>
      </div>

      {/* Hero Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-lg text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E58A3A] to-[#5C3A21] flex items-center justify-center mx-auto text-white shadow-lg shadow-[#E58A3A]/30 animate-pulse">
          <Coffee className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-[#8A7A6E]">
            Ticket #{order.id}
          </span>
          <h2 className="text-xl font-extrabold text-[#241A14] mt-0.5">
            {steps[currentStepIdx]?.label}
          </h2>
          <p className="text-xs text-[#8A7A6E] mt-1">
            {steps[currentStepIdx]?.desc}
          </p>
        </div>

        {/* Live Stepper Indicator */}
        <div className="pt-4 flex items-center justify-between relative px-2">
          {/* Horizontal line */}
          <div className="absolute left-8 right-8 top-8 h-1 bg-[#EAE3D9] z-0" />
          <div
            style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
            className="absolute left-8 top-8 h-1 bg-[#5C3A21] z-0 transition-all duration-700"
          />

          {steps.map((st, i) => {
            const isCompleted = i <= currentStepIdx;
            const Icon = st.icon;

            return (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-[#5C3A21] text-white shadow-md'
                      : 'bg-white border-2 border-[#EAE3D9] text-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold mt-2 text-center max-w-[60px] ${
                  isCompleted ? 'text-[#241A14]' : 'text-gray-400'
                }`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items Breakdown & Multi-Round Tickets */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E0D5] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-2">
          <h3 className="font-extrabold text-sm text-[#241A14]">
            Ordered Dishes
          </h3>
          {order.rounds && order.rounds.length > 1 && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-[#5C3A21] px-2 py-0.5 rounded-full">
              {order.rounds.length} Kitchen Rounds
            </span>
          )}
        </div>

        {order.rounds && order.rounds.length > 1 ? (
          <div className="space-y-4">
            {order.rounds.map((round) => (
              <div key={round.roundNumber} className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D5]/70 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#5C3A21] border-b border-[#E8E0D5]/50 pb-1.5">
                  <span>Round {round.roundNumber} • {round.kotNumber}</span>
                  <span className="text-[10px] text-[#8A7A6E] font-normal">{round.items.length} items</span>
                </div>
                <div className="space-y-1.5">
                  {round.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#241A14]">{item.quantity}x {item.name}</span>
                        {item.specialInstructions && (
                          <p className="text-[10px] text-[#E58A3A] italic">
                            Note: "{item.specialInstructions}"
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-[#5C3A21]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#241A14]">{item.quantity}x {item.name}</span>
                  {item.specialInstructions && (
                    <p className="text-[10px] text-[#E58A3A] italic">
                      Note: "{item.specialInstructions}"
                    </p>
                  )}
                </div>
                <span className="font-bold text-[#5C3A21]">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-[#E8E0D5] flex justify-between font-extrabold text-sm">
          <span>Total Bill (incl. taxes):</span>
          <span className="text-base text-[#5C3A21]">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* 5-Visit Digital VIP Punch Card */}
      <LoyaltyPunchCard
        customer={matchedCustomer || { name: order.customerName, visitCount: 1 }}
      />

      {/* Dynamic UPI Scan & Pay at Table (0% Gateway Commission) */}
      {order.status === 'Billing' && (
        <div className="bg-gradient-to-br from-[#FFFDF9] via-white to-[#FAF4EB] p-5 rounded-3xl border-2 border-emerald-400 shadow-md text-center space-y-3 animate-in zoom-in-95">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Instant UPI Scan & Pay (₹0 Commission)</span>
          </div>

          <div>
            <h4 className="text-base font-black text-[#241A14]">
              Pay {formatCurrency(order.total)} from Table
            </h4>
            <p className="text-xs text-[#8A7A6E]">
              Scan with PhonePe, Google Pay, Paytm or tap button below
            </p>
          </div>

          {/* Dynamic UPI QR Code */}
          <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl border border-[#E8E0D5] flex items-center justify-center shadow-xs">
            <QRCodeSVG
              value={`upi://pay?pa=${encodeURIComponent(settings?.upiId || 'the7cafe@okhdfcbank')}&pn=${encodeURIComponent(settings?.cafeName || 'The 7 Cafe')}&am=${order.total}&cu=INR&tn=Table-${order.tableName}`}
              size={135}
              level="M"
            />
          </div>

          {/* 1-Click Mobile Intent Button */}
          <a
            href={`upi://pay?pa=${encodeURIComponent(settings?.upiId || 'the7cafe@okhdfcbank')}&pn=${encodeURIComponent(settings?.cafeName || 'The 7 Cafe')}&am=${order.total}&cu=INR&tn=Table-${order.tableName}`}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all block text-center"
          >
            <QrCode className="w-4 h-4" />
            <span>Open PhonePe / GPay / Paytm to Pay</span>
          </a>

          <p className="text-[10px] text-[#8A7A6E] font-mono">
            Direct Bank UPI: {settings?.upiId || 'the7cafe@okhdfcbank'}
          </p>
        </div>
      )}

      {/* Service Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={handleCallStaff}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#5C3A21] border border-[#E8E0D5] font-bold text-xs shadow-sm transition-all"
        >
          <BellRing className="w-4 h-4 text-[#E58A3A]" />
          <span>Call Waiter</span>
        </button>

        <button
          onClick={handleRequestBill}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white font-bold text-xs shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#E58A3A]" />
          <span>Request Bill</span>
        </button>
      </div>

      <div className="text-center pt-2">
        <Link
          to={`/menu?table=${encodeURIComponent(order.tableName)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C3A21] hover:underline"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add More Food / Drinks</span>
        </Link>
      </div>
    </div>
  );
}
