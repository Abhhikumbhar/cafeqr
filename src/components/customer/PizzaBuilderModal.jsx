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
  ShoppingBag,
  Info
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

// ==========================================
// REALISTIC SVG INGREDIENTS (BHAJI & TOPPINGS)
// ==========================================

// 1. Crunchy Green Capsicum (Bell Pepper Slice)
const CapsicumSlice = () => (
  <svg viewBox="0 0 38 24" className="w-8 h-5 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] select-none">
    <defs>
      <linearGradient id="capSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14532d" />
        <stop offset="50%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
      <linearGradient id="capFlesh" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
    </defs>
    {/* Dark green shiny skin arc */}
    <path d="M 3,21 C 9,4 29,4 35,21 C 32,20 26,7 19,7 C 12,7 6,20 3,21 Z" fill="url(#capSkin)" />
    {/* Crunchy inner bright green flesh */}
    <path d="M 5,20 C 10,7 28,7 33,20 C 30,19 25,9 19,9 C 13,9 8,19 5,20 Z" fill="url(#capFlesh)" opacity="0.9" />
    {/* Fresh gloss highlight on skin */}
    <path d="M 11,6 C 16,5 22,5 27,6" stroke="#bbf7d0" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8" />
  </svg>
);

// 2. Crisp Red Onion Crescent
const RedOnionSlice = () => (
  <svg viewBox="0 0 42 26" className="w-8 h-5 drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] select-none">
    <defs>
      <linearGradient id="onionSkin" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#701a75" />
        <stop offset="50%" stopColor="#9d174d" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
      <linearGradient id="onionFlesh" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fdf4ff" />
        <stop offset="60%" stopColor="#fae8ff" />
        <stop offset="100%" stopColor="#fdf2f8" />
      </linearGradient>
    </defs>
    {/* Outer purple-magenta skin curve */}
    <path d="M 4,23 C 12,4 30,4 38,23 C 35,22 28,7 21,7 C 14,7 7,22 4,23 Z" fill="url(#onionSkin)" />
    {/* Inner white translucent onion layer */}
    <path d="M 6,22 C 13,7 29,7 36,22 C 33,20 27,9 21,9 C 15,9 9,20 6,22 Z" fill="url(#onionFlesh)" opacity="0.95" />
    {/* Thin outer magenta edge */}
    <path d="M 4,23 C 12,4 30,4 38,23" stroke="#4a044e" strokeWidth="1.2" fill="none" />
  </svg>
);

// 3. Golden Paneer Cubes (Roasted Cottage Cheese)
const PaneerCube = () => (
  <svg viewBox="0 0 28 28" className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] select-none">
    <defs>
      <linearGradient id="paneerTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffdf5" />
        <stop offset="70%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
      <linearGradient id="paneerSear" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>
    {/* Paneer Cube Body */}
    <rect x="3" y="3" width="22" height="22" rx="4" fill="url(#paneerTop)" stroke="#fde047" strokeWidth="0.8" />
    {/* Golden pan-seared grilled marks */}
    <rect x="5" y="5" width="18" height="6" rx="2" fill="url(#paneerSear)" opacity="0.75" />
    <circle cx="8" cy="17" r="2.2" fill="#b45309" opacity="0.65" />
    <circle cx="16" cy="18" r="2.8" fill="#d97706" opacity="0.7" />
    <circle cx="19" cy="9" r="1.5" fill="#78350f" opacity="0.6" />
    {/* Paprika & herb dusting */}
    <circle cx="12" cy="14" r="0.8" fill="#dc2626" />
    <circle cx="7" cy="11" r="0.7" fill="#dc2626" />
    <circle cx="18" cy="14" r="0.8" fill="#15803d" />
    {/* Bevel highlight */}
    <path d="M 4,4 L 24,4" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
  </svg>
);

// 4. Sliced Button Mushroom
const MushroomSlice = () => (
  <svg viewBox="0 0 32 30" className="w-7 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] select-none">
    <defs>
      <linearGradient id="shroomCap" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#a88c6d" />
        <stop offset="60%" stopColor="#8c6f4f" />
        <stop offset="100%" stopColor="#6e543c" />
      </linearGradient>
      <linearGradient id="shroomStem" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbf7f0" />
        <stop offset="100%" stopColor="#d5c4b1" />
      </linearGradient>
    </defs>
    {/* Umbrella Mushroom Cap */}
    <path d="M 3,16 C 3,5 29,5 29,16 C 26,17 21,15 16,15 C 11,15 6,17 3,16 Z" fill="url(#shroomCap)" />
    {/* Dark brown underside gill lines */}
    <path d="M 6,16 Q 16,13 26,16" stroke="#3e2a1d" strokeWidth="2.2" fill="none" opacity="0.85" />
    {/* Mushroom Stem */}
    <path d="M 12,15 L 12,27 C 12,28.5 20,28.5 20,27 L 20,15 Z" fill="url(#shroomStem)" />
    <path d="M 12,15 Q 16,17 20,15" stroke="#785c3e" strokeWidth="1" fill="none" opacity="0.5" />
    {/* Smooth cap reflection highlight */}
    <ellipse cx="16" cy="8" rx="8" ry="3" fill="#ffffff" opacity="0.25" />
  </svg>
);

// 5. Juicy Sweet Corn Kernel
const CornKernel = () => (
  <svg viewBox="0 0 18 20" className="w-3.5 h-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] select-none">
    <defs>
      <linearGradient id="cornGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
    </defs>
    <path d="M 9,2 C 15,2 17,9 15,16 C 14,18 10,19 9,19 C 8,19 4,18 3,16 C 1,9 3,2 9,2 Z" fill="url(#cornGrad)" stroke="#ca8a04" strokeWidth="0.8" />
    {/* Specular gloss reflection */}
    <ellipse cx="7" cy="6" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.85" transform="rotate(-15 7 6)" />
    {/* Corn kernel base germ */}
    <ellipse cx="9" cy="17" rx="1.5" ry="0.8" fill="#fef9c3" opacity="0.95" />
  </svg>
);

// 6. Sliced Black Olive Ring
const BlackOliveRing = () => (
  <svg viewBox="0 0 26 26" className="w-6 h-6 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)] select-none">
    <defs>
      <radialGradient id="oliveRim" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#3f3f46" />
        <stop offset="60%" stopColor="#18181b" />
        <stop offset="100%" stopColor="#09090b" />
      </radialGradient>
    </defs>
    {/* Glossy dark ripe olive outer ring */}
    <circle cx="13" cy="13" r="11" fill="url(#oliveRim)" stroke="#52525b" strokeWidth="1.2" />
    {/* Inner pit hole with sauce/cheese shining through */}
    <circle cx="13" cy="13" r="4.5" fill="#facc15" opacity="0.9" />
    <circle cx="13" cy="13" r="4.5" fill="#b91c1c" opacity="0.4" />
    <circle cx="13" cy="13" r="4.5" stroke="#18181b" strokeWidth="1" fill="none" />
    {/* Olive oil specular highlight */}
    <path d="M 6,9 A 8 8 0 0 1 13,5" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
  </svg>
);

// 7. Pickled Jalapeño Ring
const JalapenoRing = () => (
  <svg viewBox="0 0 28 28" className="w-6 h-6 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] select-none">
    <defs>
      <linearGradient id="jalSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="50%" stopColor="#166534" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
    </defs>
    {/* Crinkly ridged jalapeño ring */}
    <circle cx="14" cy="14" r="11" fill="url(#jalSkin)" stroke="#16a34a" strokeWidth="1" />
    {/* Light green inner flesh */}
    <circle cx="14" cy="14" r="6" fill="#86efac" opacity="0.75" />
    {/* Hot melted cheese center */}
    <circle cx="14" cy="14" r="3.5" fill="#fde047" opacity="0.9" />
    {/* Tiny jalapeño seeds */}
    <circle cx="12" cy="12" r="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" />
    <circle cx="16" cy="13" r="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" />
    <circle cx="13" cy="16" r="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" />
    {/* Tangy vinegar gloss */}
    <path d="M 7,10 A 8 8 0 0 1 14,6" stroke="#bbf7d0" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.65" />
  </svg>
);

// 8. Extra Stretchy Mozzarella Cheese Layer
const ExtraCheeseLayer = () => (
  <div className="absolute inset-0 pointer-events-none animate-pop-drop z-20">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Molten melted cheese webbing across pizza */}
      <path
        d="M 35,75 Q 85,110 165,80 Q 120,135 45,145 Q 90,65 155,135"
        stroke="#fffbeb"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
        filter="drop-shadow(0 2px 4px rgba(180,83,9,0.35))"
      />
      <path
        d="M 55,55 Q 110,120 145,45 Q 80,105 135,155"
        stroke="#fde047"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      {/* Golden baked cheese blister spots */}
      <ellipse cx="95" cy="75" rx="8" ry="6" fill="#b45309" opacity="0.8" />
      <ellipse cx="130" cy="115" rx="7" ry="5" fill="#92400e" opacity="0.75" />
      <ellipse cx="65" cy="125" rx="6" ry="4.5" fill="#b45309" opacity="0.8" />
      <ellipse cx="115" cy="60" rx="5" ry="4" fill="#d97706" opacity="0.8" />
    </svg>
  </div>
);


export default function PizzaBuilderModal({ isOpen, onClose, onAddToCart }) {
  if (!isOpen) return null;

  // Configuration State
  const [size, setSize] = useState('Regular (7")');
  const [crust, setCrust] = useState('Classic Hand-Tossed');
  const [sauce, setSauce] = useState('Classic Italian Herb');
  const [selectedToppings, setSelectedToppings] = useState([
    'Crunchy Capsicum',
    'Crisp Red Onion',
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
    {
      id: 'Classic Hand-Tossed',
      name: 'Classic Hand-Tossed',
      desc: 'Golden oven-baked artisan crust with fluffy edges',
      price: 0,
      tag: 'Popular'
    },
    {
      id: 'Thin & Crispy',
      name: 'Thin & Crispy',
      desc: 'Light, crunchy crust toasted to perfection',
      price: 20
    },
    {
      id: 'Double Cheese Burst',
      name: 'Double Cheese Burst',
      desc: 'Stuffed crust rim overflowing with hot melted cheese',
      price: 45,
      tag: 'Chef Special'
    }
  ];

  const sauceOptions = [
    {
      id: 'Classic Italian Herb',
      name: 'Classic Italian Herb',
      desc: 'Sun-ripened tomatoes simmered with oregano & sweet basil',
      color: '#991b1b',
      price: 0
    },
    {
      id: 'Spicy Peri-Peri',
      name: 'Spicy Peri-Peri 🔥',
      desc: 'Fiery chili sauce with crushed pepper & garlic herbs',
      color: '#c2410c',
      price: 15
    },
    {
      id: 'Tandoori Makhani',
      name: 'Tandoori Makhani 🇮🇳',
      desc: 'Velvety butter makhani gravy infused with aromatic spices',
      color: '#ea580c',
      price: 20
    }
  ];

  // REALISTIC TOPPINGS LIST WITH AUTHENTIC THUMBNAIL IMAGES
  const toppingsList = [
    {
      id: 'Extra Mozzarella Cheese',
      name: 'Extra Mozzarella',
      price: 35,
      image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=160&auto=format&fit=crop&q=80',
      badge: '🧀 Rich Cheese'
    },
    {
      id: 'Golden Paneer Cubes',
      name: 'Fresh Paneer Cubes',
      price: 30,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=160&auto=format&fit=crop&q=80',
      badge: '🧈 Cottage Cheese'
    },
    {
      id: 'Crunchy Capsicum',
      name: 'Green Capsicum',
      price: 15,
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=160&auto=format&fit=crop&q=80',
      badge: '🫑 Fresh Vegetable'
    },
    {
      id: 'Crisp Red Onion',
      name: 'Red Onion Slices',
      price: 10,
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=160&auto=format&fit=crop&q=80',
      badge: '🧅 Fresh Vegetable'
    },
    {
      id: 'Sweet Corn',
      name: 'Golden Sweet Corn',
      price: 20,
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=160&auto=format&fit=crop&q=80',
      badge: '🌽 Sweet & Juicy'
    },
    {
      id: 'Button Mushrooms',
      name: 'Sliced Mushrooms',
      price: 25,
      image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=160&auto=format&fit=crop&q=80',
      badge: '🍄 Button Shrooms'
    },
    {
      id: 'Black Olives',
      name: 'Sliced Black Olives',
      price: 25,
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=160&auto=format&fit=crop&q=80',
      badge: '🫒 Ripe Olives'
    },
    {
      id: 'Spicy Jalapeños',
      name: 'Pickled Jalapeños',
      price: 20,
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=160&auto=format&fit=crop&q=80',
      badge: '🌶️ Tangy & Hot'
    }
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

  // Dynamic visual styling for Sauce selection
  const sauceVisual = useMemo(() => {
    switch (sauce) {
      case 'Spicy Peri-Peri':
        return {
          base: 'from-[#7c2d12] via-[#c2410c] to-[#ea580c]',
          rim: 'border-[#9a3412]',
          tag: 'Spicy Peri-Peri with Red Chili Flakes'
        };
      case 'Tandoori Makhani':
        return {
          base: 'from-[#7c2d12] via-[#9a3412] to-[#c2410c]',
          rim: 'border-[#b45309]',
          tag: 'Rich Butter Makhani Sauce'
        };
      case 'Classic Italian Herb':
      default:
        return {
          base: 'from-[#7f1d1d] via-[#991b1b] to-[#b91c1c]',
          rim: 'border-[#7f1d1d]',
          tag: 'Classic Italian Herb Pomodoro'
        };
    }
  }, [sauce]);

  // Dynamic visual styling for Crust selection
  const crustVisual = useMemo(() => {
    switch (crust) {
      case 'Thin & Crispy':
        return {
          outerDough: 'from-[#b45309] via-[#92400e] to-[#78350f]',
          rimWidth: 'w-[84%] h-[84%]',
          label: 'Crispy Thin Golden Edge'
        };
      case 'Double Cheese Burst':
        return {
          outerDough: 'from-[#f59e0b] via-[#d97706] to-[#b45309]',
          rimWidth: 'w-[88%] h-[88%]',
          stuffedCheese: true,
          label: 'Cheese Burst Molten Rim'
        };
      case 'Classic Hand-Tossed':
      default:
        return {
          outerDough: 'from-[#d97706] via-[#b45309] to-[#854d0e]',
          rimWidth: 'w-[86%] h-[86%]',
          label: 'Hand-Tossed Oven-Baked Dough'
        };
    }
  }, [crust]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E8E0D5]"
      >
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-white border-b border-[#E8E0D5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-amber-100 text-[#5C3A21] shadow-xs">
              <ChefHat className="w-5 h-5 text-[#E58A3A]" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-[#241A14] flex items-center gap-2">
                <span>Build Your Pizza</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">
                  Live Oven Preview
                </span>
              </h2>
              <p className="text-[11px] text-[#8A7A6E]">
                Select authentic toppings, artisan crust & sauces
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">

          {/* 1. VISUAL PIZZA PREVIEW CANVAS (REALISTIC OVEN-BAKED PIZZA) */}
          <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-square mx-auto flex items-center justify-center select-none py-1">
            
            {/* Dark Acacia Wood Serving Peel / Board */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#452610] via-[#331a0b] to-[#1f1006] shadow-2xl border-4 border-[#2b1609] transform rotate-1 flex items-center justify-center overflow-hidden">
              {/* Natural wood grain rings */}
              <div className="w-[96%] h-[96%] rounded-full border border-[#6b3f20]/30" />
              <div className="w-[88%] h-[88%] rounded-full border border-[#6b3f20]/20" />
              {/* Warm board bevel reflection */}
              <div className="absolute top-2 left-6 right-6 h-6 bg-white/5 rounded-full blur-xs" />
            </div>

            {/* Pizza Crust Dough Layer */}
            <div 
              className={`relative ${crustVisual.rimWidth} rounded-full bg-gradient-to-br ${crustVisual.outerDough} shadow-[inset_0_4px_10px_rgba(0,0,0,0.45)] border-[5px] border-[#78350f] flex items-center justify-center overflow-hidden animate-pizza-entry transition-all duration-300`}
            >
              {/* Realistic Baked Bread Char Spots (Leopard Spots on Artisan Crust) */}
              <div className="absolute top-2 left-10 w-4 h-3 rounded-full bg-[#451a03] opacity-80 blur-[0.6px]" />
              <div className="absolute top-8 right-6 w-5 h-3.5 rounded-full bg-[#451a03] opacity-75 blur-[0.6px]" />
              <div className="absolute bottom-4 left-14 w-6 h-4 rounded-full bg-[#451a03] opacity-80 blur-[0.6px]" />
              <div className="absolute bottom-10 right-10 w-4 h-3 rounded-full bg-[#3b1702] opacity-75 blur-[0.6px]" />
              <div className="absolute top-1/2 left-2 w-3.5 h-2.5 rounded-full bg-[#451a03] opacity-85 blur-[0.6px]" />
              <div className="absolute top-1/2 right-2 w-4 h-3 rounded-full bg-[#3b1702] opacity-80 blur-[0.6px]" />
              
              {/* Golden toasted crust rim shadow */}
              <div className="absolute inset-1.5 rounded-full border-2 border-[#fef3c7]/20 pointer-events-none" />

              {/* Stuffed Cheese Burst Accent if selected */}
              {crustVisual.stuffedCheese && (
                <div className="absolute inset-1 rounded-full border-4 border-yellow-300/80 shadow-[inset_0_0_8px_#fde047] animate-pulse pointer-events-none" />
              )}

              {/* Rich Tomato / Herb Sauce Base (Spread over dough) */}
              <div 
                className={`relative w-[89%] h-[89%] rounded-full bg-gradient-to-tr ${sauceVisual.base} flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] transition-colors duration-500`}
              >
                {/* Crushed tomato pulp texture & olive oil gloss */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
                
                {/* Sprinkled Italian Oregano & Basil flecks in the sauce */}
                <div className="absolute top-6 left-12 w-1.5 h-1 rounded-full bg-[#14532d] opacity-80" />
                <div className="absolute top-14 right-10 w-1 h-1.5 rounded-full bg-[#14532d] opacity-75" />
                <div className="absolute bottom-8 left-14 w-1.5 h-1 rounded-full bg-[#14532d] opacity-75" />
                <div className="absolute bottom-14 right-14 w-1 h-1.5 rounded-full bg-[#14532d] opacity-80" />

                {/* Melted Mozzarella Cheese Base (Bubbling with golden roasted blisters) */}
                <div 
                  className="relative w-[91%] h-[91%] rounded-full bg-gradient-to-br from-[#fffdf5] via-[#fef08a] to-[#fde047] shadow-[inset_0_2px_6px_rgba(180,83,9,0.35)] flex items-center justify-center overflow-hidden"
                >
                  {/* Organic Golden Caramelized Roasted Cheese Blisters */}
                  <div className="absolute top-5 left-10 w-6 h-4 rounded-full bg-[#b45309] opacity-75 blur-[0.4px]" />
                  <div className="absolute top-14 right-12 w-7 h-5 rounded-full bg-[#92400e] opacity-70 blur-[0.4px]" />
                  <div className="absolute bottom-10 left-14 w-6 h-5 rounded-full bg-[#b45309] opacity-75 blur-[0.4px]" />
                  <div className="absolute bottom-16 right-9 w-8 h-5 rounded-full bg-[#92400e] opacity-65 blur-[0.4px]" />
                  <div className="absolute top-22 left-22 w-5 h-4 rounded-full bg-[#d97706] opacity-80 blur-[0.4px]" />
                  <div className="absolute bottom-22 right-22 w-6 h-4 rounded-full bg-[#d97706] opacity-75 blur-[0.4px]" />

                  {/* Red Sauce Dollops peeking through melted cheese */}
                  <div className="absolute top-8 left-20 w-4 h-3 rounded-full bg-[#991b1b] opacity-65 blur-[0.5px]" />
                  <div className="absolute bottom-12 left-10 w-5 h-3 rounded-full bg-[#991b1b] opacity-60 blur-[0.5px]" />
                  <div className="absolute top-16 right-20 w-4 h-3.5 rounded-full bg-[#991b1b] opacity-70 blur-[0.5px]" />

                  {/* Sprinkled Italian Oregano & Basil Flakes on Cheese */}
                  <div className="absolute top-7 left-14 w-1 h-1.5 rounded-full bg-[#14532d] rotate-45 opacity-85" />
                  <div className="absolute top-18 right-14 w-1.5 h-1 rounded-full bg-[#14532d] -rotate-20 opacity-80" />
                  <div className="absolute bottom-11 left-18 w-1 h-1.5 rounded-full bg-[#14532d] rotate-75 opacity-85" />
                  <div className="absolute bottom-18 right-18 w-1.5 h-1 rounded-full bg-[#14532d] rotate-30 opacity-80" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#dc2626] opacity-70" />

                  {/* DYNAMIC TOPPING 1: Extra Stretchy Cheese */}
                  {selectedToppings.includes('Extra Mozzarella Cheese') && (
                    <ExtraCheeseLayer />
                  )}

                  {/* DYNAMIC TOPPING 2: Crunchy Green Capsicum (Bell Pepper) */}
                  {selectedToppings.includes('Crunchy Capsicum') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {[
                        { top: '16%', left: '46%', rot: '28deg' },
                        { top: '38%', left: '16%', rot: '-45deg' },
                        { top: '56%', left: '56%', rot: '75deg' },
                        { top: '74%', left: '26%', rot: '-18deg' },
                        { top: '30%', left: '44%', rot: '115deg' },
                        { top: '64%', left: '38%', rot: '-80deg' }
                      ].map((pos, i) => (
                        <div
                          key={`cap-${i}`}
                          className="absolute"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`
                          }}
                        >
                          <div
                            className="animate-pop-drop"
                            style={{ animationDelay: `${i * 35}ms` }}
                          >
                            <CapsicumSlice />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 3: Crisp Red Onion */}
                  {selectedToppings.includes('Crisp Red Onion') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {[
                        { top: '24%', left: '38%', rot: '-25deg' },
                        { top: '44%', left: '12%', rot: '65deg' },
                        { top: '58%', left: '40%', rot: '-70deg' },
                        { top: '36%', left: '68%', rot: '15deg' },
                        { top: '68%', left: '50%', rot: '45deg' }
                      ].map((pos, i) => (
                        <div
                          key={`onion-${i}`}
                          className="absolute"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`
                          }}
                        >
                          <div
                            className="animate-pop-drop"
                            style={{ animationDelay: `${i * 40}ms` }}
                          >
                            <RedOnionSlice />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 4: Golden Paneer Cubes */}
                  {selectedToppings.includes('Golden Paneer Cubes') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {[
                        { top: '22%', left: '26%', rot: '14deg' },
                        { top: '26%', left: '58%', rot: '-18deg' },
                        { top: '50%', left: '22%', rot: '25deg' },
                        { top: '62%', left: '52%', rot: '-10deg' },
                        { top: '40%', left: '42%', rot: '45deg' },
                        { top: '68%', left: '34%', rot: '-28deg' }
                      ].map((pos, i) => (
                        <div
                          key={`paneer-${i}`}
                          className="absolute"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`
                          }}
                        >
                          <div
                            className="animate-pop-drop"
                            style={{ animationDelay: `${i * 45}ms` }}
                          >
                            <PaneerCube />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 5: Sliced Button Mushrooms */}
                  {selectedToppings.includes('Button Mushrooms') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {[
                        { top: '26%', left: '32%', rot: '-15deg' },
                        { top: '36%', left: '56%', rot: '35deg' },
                        { top: '60%', left: '28%', rot: '80deg' },
                        { top: '64%', left: '48%', rot: '-45deg' },
                        { top: '44%', left: '32%', rot: '15deg' }
                      ].map((pos, i) => (
                        <div
                          key={`shroom-${i}`}
                          className="absolute"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`
                          }}
                        >
                          <div
                            className="animate-pop-drop"
                            style={{ animationDelay: `${i * 50}ms` }}
                          >
                            <MushroomSlice />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 6: Juicy Sweet Corn */}
                  {selectedToppings.includes('Sweet Corn') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {[
                        { top: '15%', left: '42%' },
                        { top: '24%', left: '18%' },
                        { top: '32%', left: '68%' },
                        { top: '46%', left: '30%' },
                        { top: '56%', left: '64%' },
                        { top: '74%', left: '46%' },
                        { top: '66%', left: '16%' },
                        { top: '36%', left: '52%' },
                        { top: '78%', left: '30%' },
                        { top: '22%', left: '50%' },
                        { top: '50%', left: '48%' },
                        { top: '62%', left: '24%' }
                      ].map((pos, i) => (
                        <div
                          key={`corn-${i}`}
                          className="absolute"
                          style={{ top: pos.top, left: pos.left }}
                        >
                          <div
                            className="animate-pop-drop"
                            style={{ animationDelay: `${i * 25}ms` }}
                          >
                            <CornKernel />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 7: Black Olives */}
                  {selectedToppings.includes('Black Olives') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {[
                        { top: '18%', left: '38%' },
                        { top: '32%', left: '32%' },
                        { top: '42%', left: '62%' },
                        { top: '62%', left: '40%' },
                        { top: '50%', left: '16%' },
                        { top: '28%', left: '74%' },
                        { top: '70%', left: '20%' }
                      ].map((pos, i) => (
                        <div
                          key={`olive-${i}`}
                          className="absolute"
                          style={{ top: pos.top, left: pos.left }}
                        >
                          <div
                            className="animate-pop-drop"
                            style={{ animationDelay: `${i * 45}ms` }}
                          >
                            <BlackOliveRing />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC TOPPING 8: Spicy Jalapeños */}
                  {selectedToppings.includes('Spicy Jalapeños') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {[
                        { top: '22%', left: '20%' },
                        { top: '30%', left: '60%' },
                        { top: '48%', left: '36%' },
                        { top: '66%', left: '58%' },
                        { top: '70%', left: '18%' }
                      ].map((pos, i) => (
                        <div
                          key={`jalapeno-${i}`}
                          className="absolute"
                          style={{ top: pos.top, left: pos.left }}
                        >
                          <div
                            className="animate-pop-drop"
                            style={{ animationDelay: `${i * 40}ms` }}
                          >
                            <JalapenoRing />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Slices Indicator Lines (Golden Cut Guides) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-[78%] h-0.5 bg-[#451a03] rotate-0" />
              <div className="w-[78%] h-0.5 bg-[#451a03] rotate-60 absolute" />
              <div className="w-[78%] h-0.5 bg-[#451a03] rotate-120 absolute" />
            </div>

            {/* Live Crust & Sauce Indicator Badge */}
            <div className="absolute bottom-1 right-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-amber-200 font-bold border border-white/10 shadow-md">
              {crustVisual.label}
            </div>
          </div>

          {/* 2. CUSTOMIZER TABS */}
          <div className="flex bg-[#EFE9DF] p-1 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab('toppings')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'toppings'
                  ? 'bg-white text-[#241A14] shadow-sm'
                  : 'text-[#665A4F] hover:text-[#241A14]'
              }`}
            >
              <span>🧀 Toppings ({selectedToppings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('crust')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'crust'
                  ? 'bg-white text-[#241A14] shadow-sm'
                  : 'text-[#665A4F] hover:text-[#241A14]'
              }`}
            >
              <span>🥖 Crust & Size</span>
            </button>
            <button
              onClick={() => setActiveTab('sauce')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'sauce'
                  ? 'bg-white text-[#241A14] shadow-sm'
                  : 'text-[#665A4F] hover:text-[#241A14]'
              }`}
            >
              <span>🥫 Sauces</span>
            </button>
          </div>

          {/* TAB 1: TOPPINGS GRID (WITH REAL INGREDIENT PHOTOS) */}
          {activeTab === 'toppings' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#241A14] flex items-center gap-1">
                  <span>Pick Your Fresh Ingredients & Toppings:</span>
                </span>
                {selectedToppings.length > 0 && (
                  <button
                    onClick={() => setSelectedToppings([])}
                    className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {toppingsList.map(topping => {
                  const isSelected = selectedToppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping.id)}
                      className={`p-2 sm:p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 relative overflow-hidden ${
                        isSelected
                          ? 'bg-amber-50/90 text-[#241A14] border-[#E58A3A] shadow-md ring-2 ring-[#E58A3A]/40'
                          : 'bg-white text-[#241A14] border-[#E8E0D5] hover:border-[#C4B29F] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* High-Resolution Fresh Ingredient Photo */}
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 shadow-xs border border-[#E8E0D5] bg-amber-50">
                          <img
                            src={topping.image}
                            alt={topping.name}
                            className="w-full h-full object-cover select-none"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight truncate">
                            {topping.name}
                          </div>
                          <div className="text-[10px] font-bold text-[#D97724] mt-0.5">
                            +{formatCurrency(topping.price)}
                          </div>
                        </div>
                      </div>

                      {/* Selection Checkmark Pill */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs scale-105'
                            : 'border-[#D1C2B0] bg-[#FAF7F2]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
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
                  1. Select Pizza Size:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {sizeOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSize(opt.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        size === opt.id
                          ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-md'
                          : 'bg-white text-[#241A14] border-[#E8E0D5] hover:bg-[#FAF7F2]'
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
                  2. Select Artisan Crust Type:
                </label>
                <div className="space-y-2">
                  {crustOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCrust(opt.id)}
                      className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        crust === opt.id
                          ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-md'
                          : 'bg-white text-[#241A14] border-[#E8E0D5] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="text-left">
                        <div className="text-xs font-bold flex items-center gap-2">
                          <span>{opt.name}</span>
                          {opt.tag && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold">
                              {opt.tag}
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] mt-0.5 ${crust === opt.id ? 'text-amber-200' : 'text-[#8A7A6E]'}`}>
                          {opt.desc}
                        </p>
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
                Select Base Sauce Flavor (Slow-Cooked Recipe):
              </label>
              {sauceOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSauce(opt.id)}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    sauce === opt.id
                      ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-md'
                      : 'bg-white text-[#241A14] border-[#E8E0D5] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border-2 border-white shadow-xs"
                      style={{ backgroundColor: opt.color }}
                    />
                    <div>
                      <span className="text-xs font-bold block">{opt.name}</span>
                      <span className={`text-[10px] block ${sauce === opt.id ? 'text-amber-200' : 'text-[#8A7A6E]'}`}>
                        {opt.desc}
                      </span>
                    </div>
                  </div>
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
