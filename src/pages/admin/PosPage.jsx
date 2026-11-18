import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import ThermalReceiptModal from '../../components/common/ThermalReceiptModal';
import CashRegisterModal from '../../components/admin/CashRegisterModal';
import LoyaltyPunchCard from '../../components/common/LoyaltyPunchCard';
import { getItemFallbackImage } from '../../utils/imageFallbacks';
import {
  Calculator,
  Search,
  Plus,
  Minus,
  Trash2,
  Tag,
  CreditCard,
  QrCode,
  Banknote,
  Printer,
  Sparkles,
  Award,
  CheckCircle2,
  User,
  Phone,
  UtensilsCrossed,
  Receipt,
  X
} from 'lucide-react';

export default function PosPage() {
  const {
    tables,
    menuItems,
    orders,
    customers,
    getCustomerByPhone,
    createOrder,
    completePayment,
    validateCoupon,
    settings,
    addToast
  } = useCafe();

  // Selected Table
  const [selectedTableId, setSelectedTableId] = useState(tables[0]?.id || 'T-01');

  // Active Category filter & search
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Cart / Bill items
  const [cartItems, setCartItems] = useState([]);

  // Customer phone & details
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [identifiedCustomer, setIdentifiedCustomer] = useState(null);

  // Coupon & discount
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Payment modal & Receipt
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchParams] = useSearchParams();

  // Pre-fill phone if provided via Quick Lookup URL
  useEffect(() => {
    const urlPhone = searchParams.get('phone');
    if (urlPhone) {
      setCustomerPhone(urlPhone);
    }
  }, [searchParams]);

  const categories = [
    'All',
    'Coffee',
    'Tea',
    'Pizza',
    'Burger',
    'Sandwich',
    'Cold Drinks',
    'Desserts',
    'Snacks'
  ];

  // If table already has an active order, option to load its items
  const currentTable = tables.find(t => t.id === selectedTableId);
  const existingOrderForTable = currentTable?.activeOrderId
    ? orders.find(o => o.id === currentTable.activeOrderId && o.status !== 'Completed')
    : null;

  // Auto-populate cart if existing order is found on this table
  useEffect(() => {
    if (existingOrderForTable) {
      setCartItems(existingOrderForTable.items || []);
      setCustomerName(existingOrderForTable.customerName || '');
      setCustomerPhone(existingOrderForTable.customerPhone || '');
    } else {
      setCartItems([]);
      setCustomerName('');
      setCustomerPhone('');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  }, [selectedTableId, existingOrderForTable?.id, existingOrderForTable?.items?.length]);

  // Lookup customer when phone number reaches 10 digits
  useEffect(() => {
    const clean = customerPhone.replace(/\D/g, '');
    if (clean.length === 10) {
      const cust = getCustomerByPhone(clean);
      if (cust) {
        setIdentifiedCustomer(cust);
        if (!customerName) setCustomerName(cust.name);
      } else {
        setIdentifiedCustomer(null);
      }
    } else {
      setIdentifiedCustomer(null);
    }
  }, [customerPhone]);

  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  // Cart operations
  const addToCart = (menuItem) => {
    if (!menuItem.available) {
      addToast('Item is currently marked out of stock', 'error');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.id === menuItem.id);
      if (existing) {
        return prev.map(i =>
          i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          isVeg: menuItem.isVeg,
          specialInstructions: ''
        }
      ];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev
        .map(i => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const updateInstruction = (id, text) => {
    setCartItems(prev =>
      prev.map(i => (i.id === id ? { ...i, specialInstructions: text } : i))
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gstRate = (settings.gstPercentage || 5) / 100;
  const gst = Math.round(subtotal * gstRate * 100) / 100;
  const finalTotal = Math.max(0, subtotal + gst - discountAmount);

  // Apply Coupon
  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponCode;
    const res = validateCoupon(code, subtotal);
    if (res.valid) {
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discount);
      addToast(`Coupon "${code}" applied: ₹${res.discount} discount!`, 'success');
    } else {
      addToast(res.message, 'error');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    addToast('Coupon removed', 'info');
  };

  // Submit to kitchen
  const handleSendToKitchen = () => {
    if (cartItems.length === 0) {
      addToast('Please add items to bill before sending', 'error');
      return;
    }

    const order = createOrder({
      tableId: currentTable.id,
      tableNumber: currentTable.number,
      tableName: currentTable.name,
      customerName: customerName || 'Walk-in Guest',
      customerPhone,
      items: cartItems,
      discount: discountAmount,
      couponApplied: appliedCoupon?.code || null,
      status: 'Order Pending'
    });

    addToast(`Order #${order.id} sent to kitchen display!`, 'success');
  };

  // Process and complete payment
  const handleCompletePayment = () => {
    let orderIdToComplete = existingOrderForTable?.id;

    // If order hasn't been created yet, create it first
    if (!orderIdToComplete) {
      const newOrder = createOrder({
        tableId: currentTable.id,
        tableNumber: currentTable.number,
        tableName: currentTable.name,
        customerName: customerName || 'Walk-in Guest',
        customerPhone,
        items: cartItems,
        discount: discountAmount,
        couponApplied: appliedCoupon?.code || null,
        status: 'Billing'
      });
      orderIdToComplete = newOrder.id;
    }

    // Complete payment & update loyalty
    const completed = completePayment({
      orderId: orderIdToComplete,
      paymentMethod: selectedPaymentMethod,
      discountAmount,
      couponCode: appliedCoupon?.code,
      customerPhone,
      customerName
    });

    if (completed) {
      setLastCompletedOrder(completed);
      setPaymentModalOpen(false);
      setShowReceiptModal(true);
      setCartItems([]);
      setCustomerPhone('');
      setCustomerName('');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241A14] flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#5C3A21]" />
            Point of Sale (POS Terminal)
          </h2>
          <p className="text-xs text-[#8A7A6E]">
            Quick billing, table dispatch, loyalty rewards, and automated thermal bills.
          </p>
        </div>

        {/* Table Selector & Register */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#241A14] to-[#3B281B] text-amber-300 border border-[#5C3A21] font-bold text-xs shadow-sm hover:scale-[1.02] transition-all"
          >
            <Banknote className="w-4 h-4 text-emerald-400" />
            <span>Cash Register & Z-Report</span>
          </button>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[#5C3A21] uppercase tracking-wider">
              Active Table:
            </label>
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              className="px-4 py-2 rounded-2xl bg-white border border-[#E8E0D5] text-[#241A14] font-bold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
            >
              {tables.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.status}) {t.activeOrderId ? `• ${t.activeOrderId}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* POS Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Menu Item Picker (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#E8E0D5] shadow-sm space-y-4">
          {/* Search bar & Veg toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7A6E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coffee, pizza, burger..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7A6E]"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                vegOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[#FAF7F2] text-[#665A4F] border-[#E8E0D5] hover:bg-[#EAE3D9]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Veg Only</span>
            </button>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-sm'
                    : 'bg-[#FAF7F2] text-[#665A4F] border-[#E8E0D5] hover:bg-[#EAE3D9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredMenuItems.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                disabled={!item.available}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                  item.available
                    ? 'bg-[#FAF7F2]/60 hover:bg-white hover:border-[#5C3A21] hover:shadow-md'
                    : 'bg-gray-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="relative mb-2.5 rounded-xl overflow-hidden aspect-video bg-[#FAF7F2]">
                    <img
                      src={item.image || getItemFallbackImage(item)}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getItemFallbackImage(item);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                      <span
                        className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-0.5 ${
                          item.isVeg ? 'border-emerald-600 bg-white' : 'border-rose-600 bg-white'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                      </span>
                      {item.isBestseller && (
                        <span className="px-1.5 py-0.5 bg-[#E58A3A] text-white text-[9px] font-bold rounded-md">
                          Star
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-[#241A14] line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-[#8A7A6E] line-clamp-2 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-[#E8E0D5]/70 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#5C3A21]">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="w-6 h-6 rounded-lg bg-[#5C3A21] text-white flex items-center justify-center group-hover:bg-[#E58A3A] transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Order Cart & Bill Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#E8E0D5] shadow-sm space-y-4">
          {/* Bill Top Table Badge & Clear */}
          <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8A7A6E] tracking-wider">
                Current Ticket
              </span>
              <h3 className="text-base font-extrabold text-[#241A14]">
                {currentTable?.name}
              </h3>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={() => setCartItems([])}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Bill</span>
              </button>
            )}
          </div>

          {/* Customer CRM Lookup for Loyalty */}
          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E0D5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5C3A21] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#E58A3A]" />
                Customer Loyalty Lookup
              </span>
              {identifiedCustomer && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#E58A3A]" />
                  {identifiedCustomer.totalVisits} Visits
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Mobile (10 digits)"
                className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-white border border-[#E8E0D5] text-[#241A14] font-medium"
              />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-white border border-[#E8E0D5] text-[#241A14] font-medium"
              />
            </div>

            {/* Identified Customer Perks / 1-Click Fast Loyalty Action */}
            {identifiedCustomer && (
              <div className="pt-1.5 space-y-2">
                {/* 1-Click Auto Reward Bar */}
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-[#E58A3A] space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#5C3A21] text-amber-300 flex items-center justify-center text-[10px] font-black">
                        #{identifiedCustomer.totalVisits || 1}
                      </span>
                      <div>
                        <span className="text-xs font-black text-[#241A14]">
                          {identifiedCustomer.name}
                        </span>
                        <span className="text-[10px] text-amber-800 font-bold ml-1.5">
                          ({identifiedCustomer.loyaltyPoints || 0} pts)
                        </span>
                      </div>
                    </div>

                    {/* 5-Stamp mini pills */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((st) => {
                        const v = identifiedCustomer.totalVisits || 1;
                        const filled = st <= (v % 5 === 0 ? 5 : v % 5) || v >= 5;
                        return (
                          <span
                            key={st}
                            className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                              filled
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-[#E8E0D5] text-[#8A7A6E]'
                            }`}
                          >
                            {filled ? '✓' : st}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* 1-Click Coupon Apply or Applied Badge */}
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-xs font-extrabold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{appliedCoupon.code} Applied (-{formatCurrency(discountAmount)})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setDiscountAmount(0);
                        }}
                        className="text-rose-700 hover:text-rose-900 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded hover:bg-rose-100"
                      >
                        Remove
                      </button>
                    </div>
                  ) : identifiedCustomer.availableCoupons?.length > 0 ? (
                    <div className="flex flex-col gap-1 pt-0.5">
                      {identifiedCustomer.availableCoupons.map((c, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleApplyCoupon(c.code)}
                          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-[11px] font-black flex items-center justify-between shadow-sm active:scale-95 transition-all"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                            <span>1-Click Apply: {c.title || c.code}</span>
                          </span>
                          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                            APPLY ➔
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-amber-900 font-medium">
                      ⭐ Visit #{identifiedCustomer.totalVisits || 1} Active! {5 - ((identifiedCustomer.totalVisits || 1) % 5 || 5)} visits to VIP ₹50 OFF reward.
                    </p>
                  )}
                </div>

                {/* Compact Stamp Card Accordion / View */}
                <LoyaltyPunchCard
                  customer={identifiedCustomer}
                  onApplyCoupon={handleApplyCoupon}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <div className="py-8 text-center text-[#8A7A6E]">
                <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold">Ticket is currently empty</p>
                <p className="text-[11px]">Select items from the catalog on the left</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl border border-[#E8E0D5] bg-[#FAF7F2]/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#241A14] flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      {item.name}
                    </span>
                    <span className="font-extrabold text-[#5C3A21]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <input
                      type="text"
                      placeholder="Special instructions (e.g. less ice)..."
                      value={item.specialInstructions || ''}
                      onChange={(e) => updateInstruction(item.id, e.target.value)}
                      className="text-[10px] py-1 px-2 rounded-lg bg-white border border-[#E8E0D5] text-[#241A14] w-2/3"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-md bg-white border border-[#E8E0D5] flex items-center justify-center text-[#5C3A21] hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-md bg-[#5C3A21] text-white flex items-center justify-center hover:bg-[#4B2E19]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Code Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7A6E]" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Promo / Milestone Code"
                className="w-full pl-9 pr-3 py-1.5 text-xs uppercase font-mono rounded-xl bg-[#FAF7F2] border border-[#E8E0D5]"
              />
            </div>
            {appliedCoupon ? (
              <button
                onClick={removeCoupon}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={() => handleApplyCoupon()}
                className="px-3 py-1.5 rounded-xl bg-[#5C3A21] text-white text-xs font-semibold hover:bg-[#4B2E19]"
              >
                Apply
              </button>
            )}
          </div>

          {/* Calculations Summary */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E0D5] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#665A4F]">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#665A4F]">
              <span>GST ({settings.gstPercentage || 5}%):</span>
              <span className="font-medium">{formatCurrency(gst)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({appliedCoupon?.code || 'Coupon'}):</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-[#241A14] pt-2 border-t border-[#E8E0D5]">
              <span>Total Payable:</span>
              <span className="text-[#5C3A21]">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleSendToKitchen}
              disabled={cartItems.length === 0}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#EAE3D9] text-[#5C3A21] border border-[#E8E0D5] font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#E58A3A]" />
              <span>Send to Kitchen</span>
            </button>

            <button
              onClick={() => setPaymentModalOpen(true)}
              disabled={cartItems.length === 0}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#E58A3A] hover:bg-[#D77A28] text-white font-extrabold text-xs shadow-md shadow-[#E58A3A]/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-4 h-4" />
              <span>Checkout & Pay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Settlement Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E0D5] relative">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] hover:text-[#241A14] flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E58A3A] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Bill Payment
              </span>
              <h3 className="text-xl font-extrabold text-[#241A14] mt-2">
                Pay {formatCurrency(finalTotal)}
              </h3>
              <p className="text-xs text-[#8A7A6E]">
                {currentTable?.name} • {cartItems.length} items
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'Cash', label: 'Cash', icon: Banknote },
                { id: 'Card', label: 'Card / POS', icon: CreditCard }
              ].map(method => {
                const Icon = method.icon;
                const isSelected = selectedPaymentMethod === method.id;

                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-md'
                        : 'bg-[#FAF7F2] text-[#665A4F] border-[#E8E0D5] hover:bg-[#EAE3D9]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Simulated UPI QR / Cash note */}
            {selectedPaymentMethod === 'UPI' && (
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E0D5] text-center mb-5">
                <p className="text-xs font-semibold text-[#241A14] mb-2">
                  Scan Cafe UPI Dynamic QR
                </p>
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-[#E8E0D5] flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-[#241A14]" />
                </div>
                <p className="text-[10px] text-[#8A7A6E] mt-2 font-mono">
                  UPI ID: the7cafe@okhdfcbank
                </p>
              </div>
            )}

            {/* Clear Table check */}
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 mb-5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Table will be marked <strong>Available</strong> upon confirmation.</span>
            </div>

            {/* Confirm Payment button */}
            <button
              onClick={handleCompletePayment}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm Payment ({selectedPaymentMethod})</span>
            </button>
          </div>
        </div>
      )}

      {/* Printable Thermal Receipt Modal */}
      {showReceiptModal && lastCompletedOrder && (
        <ThermalReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          order={lastCompletedOrder}
          settings={settings}
          type="bill"
        />
      )}

      {/* Cash Register & Day-End Z-Report Modal */}
      <CashRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
}
