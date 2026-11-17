import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Check,
  Plus,
  Flame,
  ChefHat,
  ChevronRight,
  RotateCcw,
  ShoppingBag
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function PizzaBuilderModal({ isOpen, onClose, onAddToCart }) {
  if (!isOpen) return null;

  // Configuration State
  const [size, setSize] = useState('Regular (7")');
  const [crust, setCrust] = useState('Classic Hand-Tossed');
  const [sauce, setSauce] = useState('Classic Italian Herb');
  const [selectedToppings, setSelectedToppings] = useState([
    'Sweet Corn',
    'Golden Paneer Cubes'
  ]);
  const [activeTab, setActiveTab] = useState('toppings'); // 'toppings' | 'crust' | 'sauce'

  // Pricing Options
  const sizeOptions = [
    { id: 'Regular (7")', name: 'Regular 7"', desc: 'Serves 1', basePrice: 149 },
    { id: 'Medium (10")', name: 'Medium 10"', desc: 'Serves 2-3', basePrice: 229 }
  ];

  const crustOptions = [
    { id: 'Classic Hand-Tossed', name: 'Classic Hand-Tossed', price: 0, tag: 'Popular' },
    { id: 'Thin & Crispy', name: 'Thin & Crispy', price: 20 },
    { id: 'Double Cheese Burst', name: 'Double Cheese Burst', price: 45, tag: 'Chef Special' }
  ];

  const sauceOptions = [
    { id: 'Classic Italian Herb', name: 'Classic Italian Herb', price: 0 },
    { id: 'Spicy Peri-Peri', name: 'Spicy Peri-Peri 🔥', price: 15 },
    { id: 'Tandoori Makhani', name: 'Tandoori Makhani 🇮🇳', price: 20 }
  ];

  const toppingsList = [
    { id: 'Extra Mozzarella Cheese', name: 'Extra Cheese', price: 35, icon: '🧀', color: '#FFE066' },
    { id: 'Golden Paneer Cubes', name: 'Paneer Cubes', price: 30, icon: '🧈', color: '#FFF8DC' },
    { id: 'Sweet Corn', name: 'Sweet Corn', price: 20, icon: '🌽', color: '#FFD700' },
    { id: 'Black Olives', name: 'Black Olives', price: 25, icon: '🫒', color: '#2C3539' },
    { id: 'Crunchy Capsicum', name: 'Capsicum', price: 15, icon: '🫑', color: '#2E8B57' },
    { id: 'Spicy Jalapeños', name: 'Jalapeños', price: 20, icon: '🌶️', color: '#228B22' },
    { id: 'Crisp Red Onion', name: 'Red Onion', price: 10, icon: '🧅', color: '#C71585' },
    { id: 'Button Mushrooms', name: 'Mushrooms', price: 25, icon: '🍄', color: '#D2B48C' }
  ];

  // Calculate live total price
  const totalPrice = useMemo(() => {
    const chosenSize = sizeOptions.find(s => s.id === size) || sizeOptions[0];
    const chosenCrust = crustOptions.find(c => c.id === crust) || crustOptions[0];
    const chosenSauce = sauceOptions.find(s => s.id === sauce) || sauceOptions[0];
    const toppingsTotal = selectedToppings.reduce((sum, topName) => {
      const top = toppingsList.find(t => t.id === topName);
      return sum + (top ? top.price : 0);
    }, 0);

    return chosenSize.basePrice + chosenCrust.price + chosenSauce.price + toppingsTotal;
  }, [size, crust, sauce, selectedToppings]);

  const toggleTopping = (toppingId) => {
    setSelectedToppings(prev =>
      prev.includes(toppingId)
        ? prev.filter(t => t !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleFinish = () => {
    const customItem = {
      id: `custom-pizza-${Date.now()}`,
      name: `Custom ${size} Pizza`,
      price: totalPrice,
      quantity: 1,
      isVeg: true,
      category: 'Pizza',
      description: `${crust} • ${sauce} • Toppings: ${selectedToppings.length ? selectedToppings.join(', ') : 'None'}`,
      specialInstructions: `[CUSTOM PIZZA BUILD] Crust: ${crust} | Sauce: ${sauce} | Toppings: ${selectedToppings.join(', ') || 'Plain Cheese'}`,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60'
    };

    onAddToCart(customItem, 1, customItem.specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E8E0D5]"
      >
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-white border-b border-[#E8E0D5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-100 text-amber-700">
              <ChefHat className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-[#241A14] flex items-center gap-1.5">
                <span>Build Your Pizza</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                  Live Preview
                </span>
              </h2>
              <p className="text-[11px] text-[#8A7A6E]">
                Add toppings & watch them drop onto your pizza!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#E8E0D5] flex items-center justify-center text-[#5C3A21] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* 1. VISUAL PIZZA PREVIEW CANVAS */}
          <div className="relative w-full max-w-[270px] sm:max-w-[300px] aspect-square mx-auto flex items-center justify-center select-none py-2">
            {/* Wooden Serving Board */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8C5832] via-[#6B3F20] to-[#452610] shadow-xl border-4 border-[#3D210C] transform rotate-3 flex items-center justify-center">
              <div className="w-[96%] h-[96%] rounded-full border-2 border-dashed border-[#A46A40]/40" />
            </div>

            {/* Pizza Crust Dough */}
            <div className="relative w-[86%] h-[86%] rounded-full bg-gradient-to-br from-[#E2A76F] via-[#C98242] to-[#99551D] shadow-inner border-4 border-[#B06B2E] flex items-center justify-center overflow-hidden animate-pizza-entry">
              {/* Dough Texture Bumps */}
              <div className="absolute inset-1 rounded-full border-2 border-[#D99354] opacity-50 pointer-events-none" />

              {/* Marinara Tomato Sauce Base */}
              <div className="relative w-[90%] h-[90%] rounded-full bg-gradient-to-tr from-[#9E1B1B] via-[#C53030] to-[#E53E3E] flex items-center justify-center shadow-inner">
                {/* Melted Mozzarella Cheese Base */}
                <div className="relative w-[92%] h-[92%] rounded-full bg-gradient-to-br from-[#FFF3B0] via-[#F6E05E] to-[#ECC94B] shadow-inner flex items-center justify-center overflow-hidden">
                  {/* Cheese browning spots */}
                  <div className="absolute top-4 left-8 w-4 h-3 rounded-full bg-[#D69E2E] opacity-75" />
                  <div className="absolute top-12 right-10 w-5 h-4 rounded-full bg-[#B7791F] opacity-65" />
                  <div className="absolute bottom-8 left-12 w-4 h-4 rounded-full bg-[#D69E2E] opacity-70" />
                  <div className="absolute bottom-12 right-8 w-6 h-4 rounded-full bg-[#B7791F] opacity-60" />
                  <div className="absolute top-20 left-20 w-3 h-3 rounded-full bg-[#D69E2E] opacity-70" />

                  {/* Herbs sprinkles */}
                  <div className="absolute top-6 left-16 w-1 h-1.5 rounded-full bg-emerald-800 rotate-45" />
                  <div className="absolute top-16 right-16 w-1 h-1.5 rounded-full bg-emerald-800 -rotate-12" />
                  <div className="absolute bottom-10 left-20 w-1 h-1.5 rounded-full bg-emerald-800 rotate-90" />
                  <div className="absolute bottom-16 right-20 w-1 h-1.5 rounded-full bg-emerald-800 rotate-30" />

                  {/* DYNAMIC TOPPING 1: Extra Cheese Layer */}
                  {selectedToppings.includes('Extra Mozzarella Cheese') && (
                    <div className="absolute inset-0 bg-yellow-200/50 backdrop-blur-[0.5px] animate-pop-drop flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-1 bg-yellow-100/90 rounded-full rotate-45 shadow-sm" />
                      <div className="w-20 h-1 bg-yellow-100/90 rounded-full -rotate-30 shadow-sm" />
                      <div className="w-12 h-1 bg-yellow-100/90 rounded-full rotate-80 shadow-sm" />
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 2: Golden Paneer Cubes */}
                  {selectedToppings.includes('Golden Paneer Cubes') && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[
                        { top: '22%', left: '30%', rot: '12deg' },
                        { top: '28%', left: '60%', rot: '-18deg' },
                        { top: '55%', left: '25%', rot: '25deg' },
                        { top: '65%', left: '55%', rot: '-10deg' },
                        { top: '42%', left: '45%', rot: '45deg' },
                        { top: '70%', left: '38%', rot: '-30deg' }
                      ].map((pos, i) => (
                        <div
                          key={`paneer-${i}`}
                          className="absolute w-5 h-5 rounded-md bg-[#FFFDF5] border border-[#D97706] shadow-sm flex items-center justify-center animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`,
                            animationDelay: `${i * 45}ms`
                          }}
                        >
                          <div className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]/70" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 3: Sweet Corn */}
                  {selectedToppings.includes('Sweet Corn') && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[
                        { top: '15%', left: '45%' },
                        { top: '25%', left: '20%' },
                        { top: '35%', left: '72%' },
                        { top: '48%', left: '32%' },
                        { top: '58%', left: '68%' },
                        { top: '75%', left: '48%' },
                        { top: '68%', left: '18%' },
                        { top: '38%', left: '55%' },
                        { top: '80%', left: '32%' }
                      ].map((pos, i) => (
                        <div
                          key={`corn-${i}`}
                          className="absolute w-3 h-3.5 rounded-full bg-[#FACC15] border border-[#CA8A04] shadow-xs animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            animationDelay: `${i * 35}ms`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 4: Black Olives */}
                  {selectedToppings.includes('Black Olives') && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[
                        { top: '20%', left: '40%' },
                        { top: '35%', left: '35%' },
                        { top: '45%', left: '65%' },
                        { top: '65%', left: '42%' },
                        { top: '52%', left: '18%' },
                        { top: '30%', left: '78%' }
                      ].map((pos, i) => (
                        <div
                          key={`olive-${i}`}
                          className="absolute w-5 h-5 rounded-full bg-[#18181B] border-2 border-[#3F3F46] flex items-center justify-center shadow-xs animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            animationDelay: `${i * 50}ms`
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-[#ECC94B]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 5: Crunchy Capsicum */}
                  {selectedToppings.includes('Crunchy Capsicum') && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[
                        { top: '18%', left: '55%', rot: '30deg' },
                        { top: '40%', left: '22%', rot: '-45deg' },
                        { top: '60%', left: '58%', rot: '75deg' },
                        { top: '75%', left: '28%', rot: '-15deg' },
                        { top: '32%', left: '48%', rot: '110deg' }
                      ].map((pos, i) => (
                        <div
                          key={`capsicum-${i}`}
                          className="absolute w-6 h-2 rounded-full bg-[#15803D] border border-[#166534] shadow-xs animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`,
                            animationDelay: `${i * 40}ms`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 6: Spicy Jalapeños */}
                  {selectedToppings.includes('Spicy Jalapeños') && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[
                        { top: '24%', left: '22%' },
                        { top: '32%', left: '62%' },
                        { top: '50%', left: '38%' },
                        { top: '68%', left: '60%' },
                        { top: '72%', left: '20%' }
                      ].map((pos, i) => (
                        <div
                          key={`jalapeno-${i}`}
                          className="absolute w-5 h-5 rounded-full bg-[#16A34A] border-2 border-[#15803D] flex items-center justify-center shadow-xs animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            animationDelay: `${i * 45}ms`
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-[#ECC94B]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 7: Crisp Red Onion */}
                  {selectedToppings.includes('Crisp Red Onion') && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[
                        { top: '26%', left: '48%', rot: '-20deg' },
                        { top: '45%', left: '16%', rot: '60deg' },
                        { top: '58%', left: '42%', rot: '-70deg' },
                        { top: '42%', left: '72%', rot: '15deg' }
                      ].map((pos, i) => (
                        <div
                          key={`onion-${i}`}
                          className="absolute w-7 h-2.5 rounded-full border-2 border-[#BE185D] bg-transparent shadow-xs animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`,
                            animationDelay: `${i * 40}ms`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 8: Button Mushrooms */}
                  {selectedToppings.includes('Button Mushrooms') && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[
                        { top: '28%', left: '36%', rot: '-15deg' },
                        { top: '38%', left: '58%', rot: '35deg' },
                        { top: '62%', left: '32%', rot: '80deg' },
                        { top: '65%', left: '50%', rot: '-45deg' }
                      ].map((pos, i) => (
                        <div
                          key={`mushroom-${i}`}
                          className="absolute w-5 h-4 rounded-t-full bg-[#A88C6D] border border-[#785C3E] shadow-xs animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`,
                            animationDelay: `${i * 50}ms`
                          }}
                        >
                          <div className="w-1.5 h-2 bg-[#785C3E] mx-auto mt-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Slices Indicator Lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
              <div className="w-[80%] h-0.5 bg-black/40 rotate-0" />
              <div className="w-[80%] h-0.5 bg-black/40 rotate-60 absolute" />
              <div className="w-[80%] h-0.5 bg-black/40 rotate-120 absolute" />
            </div>
          </div>

          {/* 2. CUSTOMIZER TABS */}
          <div className="flex bg-[#EFE9DF] p-1 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab('toppings')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'toppings'
                  ? 'bg-white text-[#241A14] shadow-sm'
                  : 'text-[#665A4F] hover:text-[#241A14]'
              }`}
            >
              🧀 Toppings ({selectedToppings.length})
            </button>
            <button
              onClick={() => setActiveTab('crust')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'crust'
                  ? 'bg-white text-[#241A14] shadow-sm'
                  : 'text-[#665A4F] hover:text-[#241A14]'
              }`}
            >
              🥖 Crust & Size
            </button>
            <button
              onClick={() => setActiveTab('sauce')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sauce'
                  ? 'bg-white text-[#241A14] shadow-sm'
                  : 'text-[#665A4F] hover:text-[#241A14]'
              }`}
            >
              🥫 Sauce
            </button>
          </div>

          {/* TAB 1: TOPPINGS GRID */}
          {activeTab === 'toppings' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#241A14]">
                  Pick Your Toppings (Tap to drop):
                </span>
                {selectedToppings.length > 0 && (
                  <button
                    onClick={() => setSelectedToppings([])}
                    className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {toppingsList.map(topping => {
                  const isSelected = selectedToppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-md transform scale-[1.02]'
                          : 'bg-white text-[#241A14] border-[#E8E0D5] hover:border-[#C4B29F]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{topping.icon}</span>
                        <div>
                          <div className="text-xs font-bold leading-tight">
                            {topping.name}
                          </div>
                          <div
                            className={`text-[10px] font-medium ${
                              isSelected ? 'text-amber-200' : 'text-[#8A7A6E]'
                            }`}
                          >
                            +{formatCurrency(topping.price)}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-[#D1C2B0] bg-[#FAF7F2]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CRUST & SIZE */}
          {activeTab === 'crust' && (
            <div className="space-y-4">
              {/* Size Select */}
              <div>
                <label className="text-xs font-extrabold text-[#241A14] block mb-2">
                  Select Size:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {sizeOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSize(opt.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        size === opt.id
                          ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-sm'
                          : 'bg-white text-[#241A14] border-[#E8E0D5]'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.name}</div>
                      <div className={`text-[10px] ${size === opt.id ? 'text-amber-200' : 'text-[#8A7A6E]'}`}>
                        {opt.desc} • Base {formatCurrency(opt.basePrice)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crust Select */}
              <div>
                <label className="text-xs font-extrabold text-[#241A14] block mb-2">
                  Select Crust:
                </label>
                <div className="space-y-2">
                  {crustOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCrust(opt.id)}
                      className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        crust === opt.id
                          ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-sm'
                          : 'bg-white text-[#241A14] border-[#E8E0D5]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center gap-2">
                          <span>{opt.name}</span>
                          {opt.tag && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold">
                              {opt.tag}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${crust === opt.id ? 'text-amber-200' : 'text-[#5C3A21]'}`}>
                        {opt.price === 0 ? 'Free' : `+${formatCurrency(opt.price)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SAUCE */}
          {activeTab === 'sauce' && (
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold text-[#241A14] block mb-1">
                Select Base Sauce Flavor:
              </label>
              {sauceOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSauce(opt.id)}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    sauce === opt.id
                      ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-sm'
                      : 'bg-white text-[#241A14] border-[#E8E0D5]'
                  }`}
                >
                  <span className="text-xs font-bold">{opt.name}</span>
                  <span className={`text-xs font-bold ${sauce === opt.id ? 'text-amber-200' : 'text-[#5C3A21]'}`}>
                    {opt.price === 0 ? 'Free' : `+${formatCurrency(opt.price)}`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Floating CTA Bar */}
        <div className="p-4 bg-white border-t border-[#E8E0D5] flex items-center justify-between gap-3 shrink-0 shadow-lg">
          <div>
            <span className="text-[10px] text-[#8A7A6E] block font-bold uppercase tracking-wider">
              Calculated Total:
            </span>
            <span className="text-xl font-black text-[#5C3A21] animate-price-bump">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#D97724] to-[#B85714] hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Order & Send to KOT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
