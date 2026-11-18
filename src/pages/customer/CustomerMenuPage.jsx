import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency } from '../../utils/formatters';
import ChaiMascotGreeting from '../../components/common/ChaiMascotGreeting';
import PizzaBuilderModal from '../../components/customer/PizzaBuilderModal';
import LuckySpinWheelModal from '../../components/customer/LuckySpinWheelModal';
import LoyaltyPunchCard from '../../components/common/LoyaltyPunchCard';
import {
  Coffee,
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  X,
  ChevronRight,
  CheckCircle2,
  Tag,
  Phone,
  User,
  AlertCircle
} from 'lucide-react';

export default function CustomerMenuPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    tables,
    menuItems,
    orders,
    settings,
    createOrder,
    getCustomerByPhone,
    validateCoupon,
    addToast,
    triggerConfetti
  } = useCafe();

  // Permanent table detection from QR code scan
  const rawTableParam = searchParams.get('table');
  const savedTable = typeof window !== 'undefined' ? sessionStorage.getItem('sairam_scanned_table') : null;
  const tableParamToUse = rawTableParam || savedTable || 'Table 01';
  const tableNumberParsed = String(parseInt(tableParamToUse.replace(/\D/g, '') || '1', 10)).padStart(2, '0');
  const detectedTableName = `Table ${tableNumberParsed}`;

  useEffect(() => {
    if (rawTableParam) {
      sessionStorage.setItem('sairam_scanned_table', detectedTableName);
    }
  }, [rawTableParam, detectedTableName]);

  const currentTable = tables.find(t => t.name.toLowerCase() === detectedTableName.toLowerCase()) ||
                       tables.find(t => t.number === parseInt(tableNumberParsed, 10)) ||
                       tables[0] || { id: `T-${tableNumberParsed}`, name: detectedTableName, number: parseInt(tableNumberParsed, 10) };

  // Running Table Order check
  const runningTableOrder = orders?.find(
    o => (o.tableId === currentTable.id || o.tableName?.toLowerCase() === currentTable.name?.toLowerCase()) && o.status !== 'Completed'
  );

  // Active Category filter & search
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Cartoon Mascot Welcome Animation
  const [showMascotGreeting, setShowMascotGreeting] = useState(true);

  // Pizza Customizer Modal
  const [isPizzaBuilderOpen, setIsPizzaBuilderOpen] = useState(false);

  // Lucky Spin Wheel Modal
  const [isLuckySpinOpen, setIsLuckySpinOpen] = useState(false);

  // VIP Loyalty Pass Modal
  const [isVipPassOpen, setIsVipPassOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Item customization modal
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalInstruction, setModalInstruction] = useState('');

  // Checkout inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [identifiedCustomer, setIdentifiedCustomer] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

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

  // Lookup customer when phone reaches 10 digits
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
  const filteredItems = menuItems.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesCat && matchesSearch && matchesVeg;
  });

  // Open item modal
  const openItemDetails = (item) => {
    setSelectedItemForModal(item);
    setModalQuantity(1);
    setModalInstruction('');
  };

  // Add item from modal or quick add
  const handleAddToCart = (item, quantity = 1, instruction = '') => {
    if (!item.available) {
      addToast('Sorry, this item is sold out for today', 'error');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                specialInstructions: instruction || i.specialInstructions
              }
            : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
          isVeg: item.isVeg,
          specialInstructions: instruction,
          image: item.image
        }
      ];
    });

    setSelectedItemForModal(null);
    addToast(`Added ${quantity}x ${item.name} to cart`, 'success');
  };

  const updateCartQuantity = (id, delta) => {
    setCartItems(prev =>
      prev
        .map(i => {
          if (i.id === id) {
            const next = i.quantity + delta;
            return next > 0 ? { ...i, quantity: next } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  // Totals
  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
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
      addToast(`🎉 Coupon "${code}" applied: ₹${res.discount} OFF!`, 'success');
    } else {
      addToast(res.message, 'error');
    }
  };

  // Place Order
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const newOrder = createOrder({
      tableId: currentTable.id,
      tableNumber: currentTable.number,
      tableName: currentTable.name,
      customerName: customerName || 'Valued Guest',
      customerPhone,
      items: cartItems,
      discount: discountAmount,
      couponApplied: appliedCoupon?.code || null,
      status: 'Order Pending'
    });

    triggerConfetti();
    setIsCartOpen(false);

    // Navigate to live tracking screen
    navigate(`/menu/tracking/${newOrder.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#241A14] flex flex-col font-sans pb-28">
      {/* Cartoon Mascot Welcome Greeting on QR Scan */}
      {showMascotGreeting && (
        <ChaiMascotGreeting
          tableName={currentTable.name}
          cafeName={settings.cafeName || 'The 7 Cafe'}
          onClose={() => setShowMascotGreeting(false)}
        />
      )}

      {/* Mobile-Friendly Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E0D5] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#E58A3A] to-[#5C3A21] flex items-center justify-center shadow-md shadow-[#E58A3A]/20">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-aesthetic-serif italic font-extrabold text-base text-[#241A14] tracking-wide flex items-center gap-1.5">
              {settings.cafeName || 'The 7 Cafe'}
            </h1>
            <p className="font-aesthetic-cursive text-xs text-[#75553E] font-bold tracking-wide -mt-0.5">~ coffee & conversations ~</p>
          </div>
        </div>

        {/* Permanent Auto-Locked Table Badge */}
        <div 
          onClick={() => setShowMascotGreeting(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5C3A21] text-white text-xs font-black shadow-md border border-[#E58A3A]/40 cursor-pointer active:scale-95 transition-transform"
          title="Click to see greeting"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{currentTable.name} (Auto-Locked)</span>
        </div>
      </header>

      {/* Running Table Active Check Banner */}
      {runningTableOrder && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[#5C3A21] font-bold">
                <span className="text-[#241A14] font-extrabold uppercase mr-1">Active Table Check:</span>
                Order #{runningTableOrder.id} • Current Total: {formatCurrency(runningTableOrder.total)}
              </p>
              <p className="text-[10px] text-[#8A7A6E]">
                Items added now will be dispatched to kitchen as <strong>Round {(runningTableOrder.rounds?.length || 1) + 1}</strong>!
              </p>
            </div>
          </div>
          <Link
            to={`/track/${runningTableOrder.id}`}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-[11px] font-bold shadow-xs transition-all"
          >
            Track Status
          </Link>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
        <div 
          onClick={() => setShowMascotGreeting(true)}
          className="bg-gradient-to-r from-[#241A14] to-[#5C3A21] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden cursor-pointer group active:scale-[0.99] transition-transform"
        >
          <div className="relative z-10 space-y-2 max-w-[62%] sm:max-w-md">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E58A3A]/30 text-[#E58A3A] font-extrabold text-[10px] uppercase tracking-wider border border-[#E58A3A]/40 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              📍 {currentTable.name} Scanned • Direct KOT
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              Welcome to <span className="font-aesthetic-serif italic font-extrabold tracking-wider text-amber-200">{settings.cafeName || 'The 7 Cafe'}</span>
            </h2>
            <p className="text-xs text-[#C8BAAA]">
              Order directly from your phone. Items are freshly handcrafted and sent straight to the barista & kitchen!
            </p>
          </div>

          {/* Mini Cute Illustration in banner */}
          <div className="absolute right-3 bottom-2 sm:right-6 sm:bottom-4 flex flex-col items-center select-none">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white/60 animate-float-gentle group-hover:scale-105 transition-transform bg-[#F5ECE0]">
              <img
                src="/images/welcome-mascot.jpg"
                alt="The 7 Cafe"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[9px] font-bold text-amber-200/95 bg-black/55 px-2 py-0.5 rounded-full border border-amber-300/30 -mt-2 z-10 shadow-xs flex items-center gap-1">
              <span>☕</span> The 7 Cafe
            </span>
          </div>

          <div className="absolute right-[-20px] bottom-[-20px] w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        </div>
      </div>

      {/* Aesthetic Cafe Story Highlights (Instagram Story Rings) */}
      <div className="px-4 sm:px-6 max-w-3xl mx-auto w-full mb-3 -mt-1">
        <div className="flex items-center gap-3.5 sm:gap-6 overflow-x-auto pb-2 pt-1 scrollbar-none justify-between sm:justify-center">
          {/* Story 1: Custom Pizza Builder */}
          <button
            onClick={() => setIsPizzaBuilderOpen(true)}
            className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none transition-transform active:scale-95"
          >
            <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-[#E58A3A] shadow-md group-hover:scale-105 transition-all relative">
              <div className="p-0.5 rounded-full bg-[#FAF7F2]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#FFF6EC] to-[#FCE8D3] flex items-center justify-center text-2xl shadow-inner relative overflow-hidden">
                  <span className="transform group-hover:scale-115 transition-transform duration-300">
                    🍕
                  </span>
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-tight text-white bg-rose-500 shadow-xs border border-white/80">
                Craft
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#3B281B] group-hover:text-[#E58A3A] transition-colors tracking-tight text-center max-w-[68px] leading-tight">
              Build Pizza
            </span>
          </button>

          {/* Story 2: Lucky Spin the Wheel */}
          <button
            onClick={() => setIsLuckySpinOpen(true)}
            className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none transition-transform active:scale-95"
          >
            <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-emerald-500 via-amber-400 to-[#5C3A21] shadow-md group-hover:scale-105 transition-all relative">
              <div className="p-0.5 rounded-full bg-[#FAF7F2]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] flex items-center justify-center text-2xl shadow-inner relative overflow-hidden">
                  <span className="transform group-hover:rotate-45 transition-transform duration-300">
                    🎰
                  </span>
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-tight text-white bg-emerald-600 shadow-xs border border-white/80">
                Free Treat
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#3B281B] group-hover:text-[#E58A3A] transition-colors tracking-tight text-center max-w-[68px] leading-tight">
              Lucky Spin
            </span>
          </button>

          {/* Story 3: 5-Visit VIP Pass */}
          <button
            onClick={() => setIsVipPassOpen(true)}
            className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none transition-transform active:scale-95"
          >
            <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-[#D4AF37] via-amber-500 to-[#3B281B] shadow-md group-hover:scale-105 transition-all relative">
              <div className="p-0.5 rounded-full bg-[#FAF7F2]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#FAF3E8] to-[#F5E6CE] flex items-center justify-center text-2xl shadow-inner relative overflow-hidden">
                  <span className="transform group-hover:scale-115 transition-transform duration-300">
                    ☕
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-tight text-white bg-[#5C3A21] shadow-xs border border-white/80">
                5 Visits
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#3B281B] group-hover:text-[#E58A3A] transition-colors tracking-tight text-center max-w-[68px] leading-tight">
              VIP Pass
            </span>
          </button>

          {/* Story 4: Our Couple Story / Cafe Vibe */}
          <button
            onClick={() => setShowMascotGreeting(true)}
            className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none transition-transform active:scale-95"
          >
            <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-rose-400 via-amber-300 to-purple-400 shadow-md group-hover:scale-105 transition-all relative">
              <div className="p-0.5 rounded-full bg-[#FAF7F2]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3] flex items-center justify-center text-2xl shadow-inner relative overflow-hidden">
                  <span className="transform group-hover:scale-115 transition-transform duration-300">
                    💑
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-tight text-white bg-purple-600 shadow-xs border border-white/80">
                Vibe
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#3B281B] group-hover:text-[#E58A3A] transition-colors tracking-tight text-center max-w-[68px] leading-tight">
              Our Vibe
            </span>
          </button>
        </div>
      </div>

      {/* Search & Veg Filter */}
      <div className="px-4 sm:px-6 max-w-3xl mx-auto w-full space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7A6E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, pizza, burgers..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white border border-[#E8E0D5] text-[#241A14] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
            />
          </div>

          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
              vegOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-[#665A4F] border-[#E8E0D5]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Veg Only</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-sm'
                  : 'bg-white text-[#665A4F] border-[#E8E0D5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Dishes List */}
      <div className="px-4 sm:px-6 max-w-3xl mx-auto w-full mt-4 space-y-3">
        {/* If Pizza category active, show Customizer Card */}
        {activeCategory === 'Pizza' && (
          <div
            onClick={() => setIsPizzaBuilderOpen(true)}
            className="bg-gradient-to-r from-[#D97724] to-[#B85714] rounded-3xl p-4 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-between cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-2xl bg-white/20 backdrop-blur-xs transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
                🍕
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                  Interactive Builder
                </span>
                <h4 className="font-extrabold text-sm mt-0.5">
                  Create Your Own Custom Pizza
                </h4>
                <p className="text-[11px] text-amber-100">
                  Select crust, sauces & tap toppings to drop live!
                </p>
              </div>
            </div>

            <button className="px-3.5 py-1.5 rounded-xl bg-white text-[#5C3A21] text-xs font-black shadow-md shrink-0 flex items-center gap-1 group-hover:bg-amber-100 transition-colors">
              <span>Start</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => openItemDetails(item)}
            className="bg-white rounded-3xl p-3.5 border border-[#E8E0D5] shadow-sm hover:shadow-md transition-all flex gap-3.5 cursor-pointer relative"
          >
            {/* Dish Image */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1.5 left-1.5">
                <span
                  className={`w-4 h-4 rounded-md border flex items-center justify-center p-0.5 ${
                    item.isVeg ? 'border-emerald-600 bg-white' : 'border-rose-600 bg-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  />
                </span>
              </div>
            </div>

            {/* Dish Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-[#241A14] truncate">
                    {item.name}
                  </h3>
                  {item.isBestseller && (
                    <span className="px-1.5 py-0.5 rounded-md bg-[#E58A3A] text-white text-[9px] font-extrabold">
                      Star
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#8A7A6E] line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-extrabold text-sm text-[#5C3A21]">
                  {formatCurrency(item.price)}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item, 1);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#5C3A21] hover:text-white text-[#5C3A21] border border-[#E8E0D5] text-xs font-extrabold transition-all flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bottom Cart Bar (if items in cart) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto animate-slide-up">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#5C3A21] text-white rounded-3xl p-4 shadow-2xl flex items-center justify-between hover:bg-[#4B2E19] transition-all transform active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#E58A3A] text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
              <div className="text-left">
                <p className="text-xs font-bold">View Cart Ticket</p>
                <p className="text-[10px] text-[#C8BAAA]">for {currentTable.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base">{formatCurrency(finalTotal)}</span>
              <ChevronRight className="w-5 h-5 text-[#E58A3A]" />
            </div>
          </button>
        </div>
      )}

      {/* Item Details / Customization Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E0D5] relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedItemForModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>

            <img
              src={selectedItemForModal.image}
              alt={selectedItemForModal.name}
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />

            <div className="space-y-1 mb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-[#241A14]">
                  {selectedItemForModal.name}
                </h3>
                <span className="font-extrabold text-base text-[#5C3A21]">
                  {formatCurrency(selectedItemForModal.price)}
                </span>
              </div>
              <p className="text-xs text-[#8A7A6E]">
                {selectedItemForModal.description}
              </p>
            </div>

            {/* Special Instructions for Chef */}
            <div className="space-y-1.5 mb-4">
              <label className="text-xs font-bold text-[#665A4F] block">
                Special Requests for Kitchen (Optional)
              </label>
              <input
                type="text"
                value={modalInstruction}
                onChange={(e) => setModalInstruction(e.target.value)}
                placeholder="e.g. Extra spicy, oat milk, less ice..."
                className="w-full text-xs py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
              />
            </div>

            {/* Quantity Selector & Add Button */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#E8E0D5]">
              <div className="flex items-center gap-2 border border-[#E8E0D5] rounded-2xl p-1 bg-[#FAF7F2]">
                <button
                  onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-bold text-[#5C3A21]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-bold text-sm">
                  {modalQuantity}
                </span>
                <button
                  onClick={() => setModalQuantity(modalQuantity + 1)}
                  className="w-8 h-8 rounded-xl bg-[#5C3A21] text-white flex items-center justify-center font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(selectedItemForModal, modalQuantity, modalInstruction)}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#E58A3A] hover:bg-[#D77A28] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-between"
              >
                <span>Add To Ticket</span>
                <span>{formatCurrency(selectedItemForModal.price * modalQuantity)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer / Checkout Sheet */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E0D5] relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E58A3A]">
                  Order Review
                </span>
                <h3 className="font-extrabold text-lg text-[#241A14]">
                  {currentTable.name} Ticket
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-[#241A14]">{item.name}</h4>
                    <p className="text-[10px] text-[#8A7A6E]">
                      {formatCurrency(item.price)} each
                    </p>
                    {item.specialInstructions && (
                      <p className="text-[10px] text-[#E58A3A] italic">
                        "{item.specialInstructions}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white border border-[#E8E0D5] flex items-center justify-center text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-[#5C3A21] text-white flex items-center justify-center text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Loyalty & 5-Visit Punch Pass (Name + Phone) */}
            <div className="space-y-2">
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8E0D5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5C3A21] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#E58A3A]" />
                    Customer Loyalty & 5-Visit Stamp Pass
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLuckySpinOpen(true)}
                    className="text-[10px] font-black text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>🎰</span>
                    <span>Spin Wheel</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-white border border-[#E8E0D5] font-bold text-[#241A14]"
                  />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name (Optional)"
                    className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-white border border-[#E8E0D5]"
                  />
                </div>
              </div>

              {/* Interactive 5-Visit Digital Punch Card */}
              <LoyaltyPunchCard
                customer={identifiedCustomer || (customerPhone ? { name: customerName, visitCount: 0 } : null)}
                onApplyCoupon={handleApplyCoupon}
                compact={true}
              />
            </div>

            {/* Coupon Promo code input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter Coupon / Promo Code"
                className="flex-1 py-1.5 px-3 text-xs uppercase font-mono rounded-xl bg-[#FAF7F2] border border-[#E8E0D5]"
              />
              <button
                onClick={() => handleApplyCoupon()}
                className="px-3.5 py-1.5 bg-[#5C3A21] text-white rounded-xl text-xs font-bold"
              >
                Apply
              </button>
            </div>

            {/* Bill summary */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E0D5] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#665A4F]">
                <span>Items Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#665A4F]">
                <span>GST ({settings.gstPercentage || 5}%):</span>
                <span>{formatCurrency(gst)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-[#241A14] pt-2 border-t border-[#E8E0D5]">
                <span>Total Amount:</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#E58A3A] hover:bg-[#D77A28] text-white font-extrabold text-sm shadow-xl shadow-[#E58A3A]/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Order to Kitchen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Live Interactive Pizza Builder Modal (Reel-style Customizer) */}
      <PizzaBuilderModal
        isOpen={isPizzaBuilderOpen}
        onClose={() => setIsPizzaBuilderOpen(false)}
        onAddToCart={(item, qty, instructions) => {
          handleAddToCart(item, qty, instructions);
          triggerConfetti();
        }}
      />

      {/* Dedicated 5-Visit VIP Punch Card Modal */}
      {isVipPassOpen && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border-2 border-[#EADCCB] relative">
            <button
              onClick={() => setIsVipPassOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF5EE] text-[#665A4F] flex items-center justify-center font-bold text-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5C3A21] bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                The 7 Cafe VIP Club
              </span>
              <h3 className="text-xl font-black text-[#241A14] mt-1.5">
                5-Visit Loyalty Pass
              </h3>
              <p className="text-xs text-[#8A7A6E]">
                Enter your mobile number to check your stamps and unlock free drinks!
              </p>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7A6E]" />
                <input
                  type="tel"
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs font-bold text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
                />
              </div>
            </div>

            <LoyaltyPunchCard
              customer={identifiedCustomer || (customerPhone ? { name: customerName, visitCount: 0 } : null)}
              onApplyCoupon={(code) => {
                handleApplyCoupon(code);
                setIsVipPassOpen(false);
                setIsCartOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Lucky Spin Wheel Interactive Modal */}
      <LuckySpinWheelModal
        isOpen={isLuckySpinOpen}
        onClose={() => setIsLuckySpinOpen(false)}
        onApplyPrize={(prize) => {
          if (prize.code) {
            handleApplyCoupon(prize.code);
            setIsCartOpen(true);
          }
        }}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        triggerConfetti={triggerConfetti}
        addToast={addToast}
      />
    </div>
  );
}
