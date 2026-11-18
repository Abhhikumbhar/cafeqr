import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Eye,
  Compass,
  Play,
  Pause,
  Layers
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

// ==========================================
// REALISTIC TOPPING COMPONENTS (BHAJI & MATERIAL)
// ==========================================

// 1. Crunchy Green Capsicum (Bell Pepper Slice)
const CapsicumSlice = () => (
  <svg viewBox="0 0 42 26" className="w-9 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none">
    <defs>
      <linearGradient id="capSkin3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14532d" />
        <stop offset="50%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
      <linearGradient id="capFlesh3d" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
    </defs>
    <path d="M 3,23 C 10,4 32,4 39,23 C 35,22 28,8 21,8 C 14,8 7,22 3,23 Z" fill="url(#capSkin3d)" />
    <path d="M 6,21 C 12,7 30,7 36,21 C 32,20 27,10 21,10 C 15,10 10,20 6,21 Z" fill="url(#capFlesh3d)" opacity="0.95" />
    <path d="M 12,7 C 18,5.5 24,5.5 30,7" stroke="#bbf7d0" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.85" />
  </svg>
);

// 2. Crisp Red Onion Crescent
const RedOnionSlice = () => (
  <svg viewBox="0 0 44 28" className="w-9 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] select-none">
    <defs>
      <linearGradient id="onionSkin3d" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#701a75" />
        <stop offset="50%" stopColor="#9d174d" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
      <linearGradient id="onionFlesh3d" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#fae8ff" />
        <stop offset="100%" stopColor="#fdf2f8" />
      </linearGradient>
    </defs>
    <path d="M 4,25 C 13,4 31,4 40,25 C 37,23 29,8 22,8 C 15,8 7,23 4,25 Z" fill="url(#onionSkin3d)" />
    <path d="M 6,23 C 14,8 30,8 38,23 C 34,21 28,10 22,10 C 16,10 10,21 6,23 Z" fill="url(#onionFlesh3d)" opacity="0.95" />
    <path d="M 4,25 C 13,4 31,4 40,25" stroke="#4a044e" strokeWidth="1.2" fill="none" />
  </svg>
);

// 3. Golden Tandoori Paneer Cubes
const PaneerCube = () => (
  <svg viewBox="0 0 30 30" className="w-7 h-7 drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)] select-none">
    <defs>
      <linearGradient id="paneerTop3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffdf5" />
        <stop offset="70%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
      <linearGradient id="paneerSear3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="24" height="24" rx="4" fill="url(#paneerTop3d)" stroke="#fde047" strokeWidth="0.8" />
    <rect x="5" y="5" width="20" height="7" rx="2" fill="url(#paneerSear3d)" opacity="0.8" />
    <circle cx="9" cy="18" r="2.5" fill="#b45309" opacity="0.7" />
    <circle cx="18" cy="19" r="3" fill="#d97706" opacity="0.75" />
    <circle cx="21" cy="9" r="1.8" fill="#78350f" opacity="0.65" />
    <circle cx="14" cy="15" r="0.9" fill="#dc2626" />
    <circle cx="8" cy="11" r="0.8" fill="#dc2626" />
    <circle cx="20" cy="15" r="0.8" fill="#15803d" />
    <path d="M 4,4 L 26,4" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
  </svg>
);

// 4. Sliced Button Mushroom
const MushroomSlice = () => (
  <svg viewBox="0 0 34 32" className="w-8 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] select-none">
    <defs>
      <linearGradient id="shroomCap3d" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#a88c6d" />
        <stop offset="60%" stopColor="#8c6f4f" />
        <stop offset="100%" stopColor="#6e543c" />
      </linearGradient>
      <linearGradient id="shroomStem3d" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbf7f0" />
        <stop offset="100%" stopColor="#d5c4b1" />
      </linearGradient>
    </defs>
    <path d="M 3,17 C 3,5 31,5 31,17 C 28,18 22,16 17,16 C 12,16 6,18 3,17 Z" fill="url(#shroomCap3d)" />
    <path d="M 6,17 Q 17,14 28,17" stroke="#3e2a1d" strokeWidth="2.4" fill="none" opacity="0.9" />
    <path d="M 13,16 L 13,29 C 13,30.5 21,30.5 21,29 L 21,16 Z" fill="url(#shroomStem3d)" />
    <path d="M 13,16 Q 17,18 21,16" stroke="#785c3e" strokeWidth="1.2" fill="none" opacity="0.6" />
    <ellipse cx="17" cy="9" rx="9" ry="3.5" fill="#ffffff" opacity="0.3" />
  </svg>
);

// 5. Juicy Sweet Corn Kernel
const CornKernel = () => (
  <svg viewBox="0 0 20 22" className="w-4 h-4.5 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] select-none">
    <defs>
      <linearGradient id="cornGrad3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
    </defs>
    <path d="M 10,2 C 16,2 18,9 16,17 C 15,19 11,20 10,20 C 9,20 5,19 4,17 C 2,9 4,2 10,2 Z" fill="url(#cornGrad3d)" stroke="#ca8a04" strokeWidth="0.8" />
    <ellipse cx="8" cy="6" rx="3" ry="1.8" fill="#ffffff" opacity="0.85" transform="rotate(-15 8 6)" />
    <ellipse cx="10" cy="18" rx="1.6" ry="0.9" fill="#fef9c3" opacity="0.95" />
  </svg>
);

// 6. Sliced Black Olive Ring
const BlackOliveRing = () => (
  <svg viewBox="0 0 28 28" className="w-7 h-7 drop-shadow-[0_3px_5px_rgba(0,0,0,0.55)] select-none">
    <defs>
      <radialGradient id="oliveRim3d" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#3f3f46" />
        <stop offset="60%" stopColor="#18181b" />
        <stop offset="100%" stopColor="#09090b" />
      </radialGradient>
    </defs>
    <circle cx="14" cy="14" r="12" fill="url(#oliveRim3d)" stroke="#52525b" strokeWidth="1.2" />
    <circle cx="14" cy="14" r="5" fill="#facc15" opacity="0.95" />
    <circle cx="14" cy="14" r="5" fill="#b91c1c" opacity="0.45" />
    <circle cx="14" cy="14" r="5" stroke="#18181b" strokeWidth="1.2" fill="none" />
    <path d="M 6,10 A 9 9 0 0 1 14,5" stroke="#a1a1aa" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.75" />
  </svg>
);

// 7. Pickled Jalapeño Ring
const JalapenoRing = () => (
  <svg viewBox="0 0 30 30" className="w-7 h-7 drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] select-none">
    <defs>
      <linearGradient id="jalSkin3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="50%" stopColor="#166534" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
    </defs>
    <circle cx="15" cy="15" r="12" fill="url(#jalSkin3d)" stroke="#16a34a" strokeWidth="1" />
    <circle cx="15" cy="15" r="6.5" fill="#86efac" opacity="0.8" />
    <circle cx="15" cy="15" r="4" fill="#fde047" opacity="0.95" />
    <circle cx="13" cy="13" r="1.1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
    <circle cx="17" cy="14" r="1.1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
    <circle cx="14" cy="17" r="1.1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
    <path d="M 8,11 A 9 9 0 0 1 15,6" stroke="#bbf7d0" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.7" />
  </svg>
);

// 8. Extra Mozzarella Molten Layer
const ExtraCheeseLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-20">
    <svg viewBox="0 0 300 300" className="w-full h-full">
      {/* Molten melted cheese strings */}
      <path
        d="M 60,120 Q 150,180 240,110 Q 180,210 70,220 Q 140,90 220,200"
        stroke="#fffdf0"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
        opacity="0.92"
        filter="drop-shadow(0 3px 6px rgba(180,83,9,0.45))"
      />
      <path
        d="M 90,80 Q 160,190 220,70 Q 110,160 200,230"
        stroke="#fef08a"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* Golden baked cheese blister spots */}
      <ellipse cx="140" cy="110" rx="12" ry="9" fill="#b45309" opacity="0.85" />
      <ellipse cx="195" cy="170" rx="11" ry="8" fill="#92400e" opacity="0.8" />
      <ellipse cx="105" cy="190" rx="9" ry="7" fill="#b45309" opacity="0.85" />
      <ellipse cx="170" cy="90" rx="8" ry="6" fill="#d97706" opacity="0.85" />
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

  // ==========================================
  // 360 DEGREE 3D INTERACTIVE ROTATION SYSTEM
  // ==========================================
  const [rotation, setRotation] = useState(0); // 0 to 360 deg
  const [tilt, setTilt] = useState(26); // 3D tilt: 0 (top-down) to 48 (deep 3D)
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rot: 0, tilt: 26 });

  // 360 Auto-Spin loop
  useEffect(() => {
    if (!isAutoSpin || isDragging) return;
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.65) % 360);
    }, 32);
    return () => clearInterval(interval);
  }, [isAutoSpin, isDragging]);

  // Pointer drag event handlers for 360-degree rotation
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rot: rotation,
      tilt: tilt
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    // Horizontal drag spins 360 degrees
    let newRot = (dragStartRef.current.rot + dx * 0.85) % 360;
    if (newRot < 0) newRot += 360;
    setRotation(newRot);

    // Vertical drag adjusts 3D elevation tilt
    const newTilt = Math.max(0, Math.min(48, dragStartRef.current.tilt - dy * 0.22));
    setTilt(newTilt);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Pricing Options
  const sizeOptions = [
    { id: 'Regular (7")', name: 'Regular 7"', desc: 'Serves 1', basePrice: 149 },
    { id: 'Medium (10")', name: 'Medium 10"', desc: 'Serves 2-3', basePrice: 229 }
  ];

  const crustOptions = [
    {
      id: 'Classic Hand-Tossed',
      name: 'Classic Hand-Tossed',
      desc: 'Authentic oven-baked crust with crispy golden bubbles',
      price: 0,
      tag: 'Chef Choice'
    },
    {
      id: 'Thin & Crispy',
      name: 'Thin & Crispy',
      desc: 'Ultra-thin roasted Italian style crust with crunchy bite',
      price: 20
    },
    {
      id: 'Double Cheese Burst',
      name: 'Double Cheese Burst',
      desc: 'Thick stuffed crust rim oozing with hot molten cheese',
      price: 45,
      tag: 'Bestseller'
    }
  ];

  const sauceOptions = [
    {
      id: 'Classic Italian Herb',
      name: 'Classic Italian Herb',
      desc: 'Sun-ripened pomodoro tomatoes, olive oil, sweet basil & oregano',
      color: '#991b1b',
      price: 0
    },
    {
      id: 'Spicy Peri-Peri',
      name: 'Spicy Peri-Peri 🔥',
      desc: 'Fiery bird-eye chili sauce with roasted garlic & paprika',
      color: '#c2410c',
      price: 15
    },
    {
      id: 'Tandoori Makhani',
      name: 'Tandoori Makhani 🇮🇳',
      desc: 'Creamy buttery makhani gravy infused with slow-roasted spices',
      color: '#ea580c',
      price: 20
    }
  ];

  // REALISTIC TOPPINGS LIST WITH HIGH-RES PHOTOS
  const toppingsList = [
    {
      id: 'Extra Mozzarella Cheese',
      name: 'Extra Mozzarella',
      price: 35,
      image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=160&auto=format&fit=crop&q=80',
      badge: '🧀 Real Cheese'
    },
    {
      id: 'Golden Paneer Cubes',
      name: 'Tandoori Paneer',
      price: 30,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=160&auto=format&fit=crop&q=80',
      badge: '🧈 Fresh Paneer'
    },
    {
      id: 'Crunchy Capsicum',
      name: 'Green Capsicum',
      price: 15,
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=160&auto=format&fit=crop&q=80',
      badge: '🫑 Crisp Veg'
    },
    {
      id: 'Crisp Red Onion',
      name: 'Red Onion Slices',
      price: 10,
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=160&auto=format&fit=crop&q=80',
      badge: '🧅 Fresh Veg'
    },
    {
      id: 'Sweet Corn',
      name: 'Golden Sweet Corn',
      price: 20,
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=160&auto=format&fit=crop&q=80',
      badge: '🌽 Juicy Corn'
    },
    {
      id: 'Button Mushrooms',
      name: 'Fresh Mushrooms',
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
      badge: '🌶️ Spicy & Hot'
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
      specialInstructions: `[CUSTOM PIZZA 360° BUILD] Crust: ${crust} | Sauce: ${sauce} | Toppings: ${selectedToppings.join(', ') || 'Plain Cheese'}`,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60'
    };

    onAddToCart(customItem, 1, customItem.specialInstructions);
    onClose();
  };

  // Organic distribution coordinates across all 8 pizza slices
  // (Prevents clustering in center, spreads toppings realistically over the entire pie)
  const toppingCoordinates = useMemo(() => ({
    capsicum: [
      { top: '22%', left: '32%', rot: '28deg' },
      { top: '24%', left: '68%', rot: '-35deg' },
      { top: '48%', left: '16%', rot: '75deg' },
      { top: '54%', left: '76%', rot: '-60deg' },
      { top: '74%', left: '30%', rot: '115deg' },
      { top: '76%', left: '64%', rot: '-18deg' }
    ],
    onion: [
      { top: '34%', left: '20%', rot: '-25deg' },
      { top: '18%', left: '50%', rot: '10deg' },
      { top: '38%', left: '78%', rot: '45deg' },
      { top: '64%', left: '22%', rot: '-70deg' },
      { top: '68%', left: '72%', rot: '80deg' },
      { top: '80%', left: '46%', rot: '-15deg' }
    ],
    paneer: [
      { top: '28%', left: '44%', rot: '14deg' },
      { top: '36%', left: '60%', rot: '-22deg' },
      { top: '44%', left: '30%', rot: '35deg' },
      { top: '56%', left: '46%', rot: '-12deg' },
      { top: '66%', left: '38%', rot: '45deg' },
      { top: '62%', left: '62%', rot: '-30deg' },
      { top: '42%', left: '72%', rot: '18deg' }
    ],
    mushrooms: [
      { top: '22%', left: '58%', rot: '-15deg' },
      { top: '38%', left: '40%', rot: '35deg' },
      { top: '52%', left: '64%', rot: '-40deg' },
      { top: '62%', left: '28%', rot: '75deg' },
      { top: '74%', left: '56%', rot: '-25deg' },
      { top: '42%', left: '18%', rot: '55deg' }
    ],
    corn: [
      { top: '16%', left: '38%' },
      { top: '20%', left: '60%' },
      { top: '28%', left: '26%' },
      { top: '30%', left: '74%' },
      { top: '44%', left: '50%' },
      { top: '46%', left: '22%' },
      { top: '48%', left: '78%' },
      { top: '60%', left: '36%' },
      { top: '62%', left: '54%' },
      { top: '68%', left: '18%' },
      { top: '70%', left: '74%' },
      { top: '78%', left: '34%' },
      { top: '80%', left: '58%' },
      { top: '36%', left: '34%' },
      { top: '54%', left: '68%' }
    ],
    olives: [
      { top: '26%', left: '38%' },
      { top: '28%', left: '64%' },
      { top: '42%', left: '36%' },
      { top: '46%', left: '64%' },
      { top: '58%', left: '26%' },
      { top: '64%', left: '48%' },
      { top: '70%', left: '66%' },
      { top: '38%', left: '80%' }
    ],
    jalapenos: [
      { top: '24%', left: '48%' },
      { top: '34%', left: '24%' },
      { top: '40%', left: '68%' },
      { top: '56%', left: '38%' },
      { top: '64%', left: '60%' },
      { top: '76%', left: '42%' }
    ]
  }), []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full sm:max-w-xl max-h-[94vh] sm:max-h-[90vh] bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E8E0D5]"
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
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold uppercase tracking-wider shadow-xs">
                  360° 3D Oven
                </span>
              </h2>
              <p className="text-[11px] text-[#8A7A6E]">
                Drag pizza to spin 360° • Watch real toppings drop!
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

          {/* ======================================================== */}
          {/* 1. 360° 3D INTERACTIVE PIZZA SHOWCASE (DRAG TO ROTATE)   */}
          {/* ======================================================== */}
          <div className="relative w-full max-w-[340px] h-[310px] sm:h-[330px] mx-auto flex flex-col items-center justify-center select-none">
            
            {/* 3D Perspective Stage */}
            <div 
              className="relative w-full h-[270px] sm:h-[285px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
              style={{ perspective: 1100 }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* 3D Rotatable Turntable Container */}
              <div
                className="relative w-[255px] h-[255px] sm:w-[275px] sm:h-[275px] flex items-center justify-center"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${tilt}deg) rotateZ(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
              >
                {/* Layer 1: 3D Heavy Oak Wooden Serving Board with Depth & Bevel */}
                <div 
                  className="absolute -inset-3.5 sm:-inset-4 rounded-full bg-gradient-to-br from-[#4a2810] via-[#381c09] to-[#200f04] shadow-[0_25px_40px_rgba(0,0,0,0.65),0_10px_18px_rgba(0,0,0,0.5)] border-[5px] border-[#2b1406]"
                  style={{ transform: 'translateZ(-12px)' }}
                >
                  {/* Real Wood Grain Rings */}
                  <div className="absolute inset-1.5 rounded-full border border-[#804820]/30" />
                  <div className="absolute inset-3.5 rounded-full border border-[#804820]/20" />
                  <div className="absolute top-2 left-6 right-6 h-8 bg-white/5 rounded-full blur-xs" />
                </div>

                {/* Layer 2: 3D Pizza Base Thickness / Dough Rim Bevel */}
                <div 
                  className="absolute inset-0 rounded-full bg-[#8c4c1a] shadow-inner"
                  style={{ transform: 'translateZ(-4px)' }}
                />

                {/* Layer 3: REAL WOOD-FIRED ARTISAN PIZZA CRUST & CHEESE PHOTO */}
                <div 
                  className="relative w-full h-full rounded-full overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.5)] border-4 border-[#b45309]"
                  style={{ transform: 'translateZ(0px)' }}
                >
                  {/* High-Resolution Real Baked Pizza Photo Base */}
                  <img
                    src="/images/pizza-base.png"
                    alt="Authentic Oven-Baked Pizza"
                    className="w-full h-full object-cover select-none pointer-events-none transform scale-[1.04]"
                    draggable={false}
                  />

                  {/* Sauce Flavor Tint Overlay */}
                  {sauce === 'Spicy Peri-Peri' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/35 via-orange-600/25 to-transparent pointer-events-none mix-blend-color-burn" />
                  )}
                  {sauce === 'Tandoori Makhani' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/35 via-orange-500/25 to-transparent pointer-events-none mix-blend-color-burn" />
                  )}

                  {/* Crust Selection Effect */}
                  {crust === 'Double Cheese Burst' && (
                    <div className="absolute inset-1 rounded-full border-4 border-yellow-300/80 shadow-[inset_0_0_12px_#fde047] animate-pulse pointer-events-none" />
                  )}
                  {crust === 'Thin & Crispy' && (
                    <div className="absolute inset-0 rounded-full border-6 border-[#451a03]/50 pointer-events-none" />
                  )}

                  {/* Subtle 8-Slice Pizza Cut Guides */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-full h-[1px] bg-black rotate-0" />
                    <div className="w-full h-[1px] bg-black rotate-45 absolute" />
                    <div className="w-full h-[1px] bg-black rotate-90 absolute" />
                    <div className="w-full h-[1px] bg-black rotate-135 absolute" />
                  </div>

                  {/* ============================================== */}
                  {/* DYNAMIC TOPPINGS (DISTRIBUTED ACROSS ALL SLICES) */}
                  {/* ============================================== */}

                  {/* 1. Extra Cheese Stretchy Layer */}
                  {selectedToppings.includes('Extra Mozzarella Cheese') && (
                    <ExtraCheeseLayer />
                  )}

                  {/* 2. Crunchy Green Capsicum */}
                  {selectedToppings.includes('Crunchy Capsicum') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {toppingCoordinates.capsicum.map((pos, i) => (
                        <div
                          key={`cap-${i}`}
                          className="absolute animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`,
                            animationDelay: `${i * 30}ms`
                          }}
                        >
                          <CapsicumSlice />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 3. Crisp Red Onion */}
                  {selectedToppings.includes('Crisp Red Onion') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {toppingCoordinates.onion.map((pos, i) => (
                        <div
                          key={`onion-${i}`}
                          className="absolute animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`,
                            animationDelay: `${i * 35}ms`
                          }}
                        >
                          <RedOnionSlice />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 4. Golden Paneer Cubes */}
                  {selectedToppings.includes('Golden Paneer Cubes') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {toppingCoordinates.paneer.map((pos, i) => (
                        <div
                          key={`paneer-${i}`}
                          className="absolute animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`,
                            animationDelay: `${i * 40}ms`
                          }}
                        >
                          <PaneerCube />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 5. Button Mushrooms */}
                  {selectedToppings.includes('Button Mushrooms') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {toppingCoordinates.mushrooms.map((pos, i) => (
                        <div
                          key={`shroom-${i}`}
                          className="absolute animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rot})`,
                            animationDelay: `${i * 40}ms`
                          }}
                        >
                          <MushroomSlice />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 6. Sweet Corn Kernels */}
                  {selectedToppings.includes('Sweet Corn') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {toppingCoordinates.corn.map((pos, i) => (
                        <div
                          key={`corn-${i}`}
                          className="absolute animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            animationDelay: `${i * 20}ms`
                          }}
                        >
                          <CornKernel />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 7. Black Olives */}
                  {selectedToppings.includes('Black Olives') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {toppingCoordinates.olives.map((pos, i) => (
                        <div
                          key={`olive-${i}`}
                          className="absolute animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            animationDelay: `${i * 35}ms`
                          }}
                        >
                          <BlackOliveRing />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 8. Spicy Jalapeños */}
                  {selectedToppings.includes('Spicy Jalapeños') && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {toppingCoordinates.jalapenos.map((pos, i) => (
                        <div
                          key={`jalapeno-${i}`}
                          className="absolute animate-pop-drop"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            animationDelay: `${i * 30}ms`
                          }}
                        >
                          <JalapenoRing />
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* 360° Control Bar & Angle Badges */}
            <div className="w-full flex items-center justify-between px-2 pt-1 z-20">
              {/* Rotation Degree Counter */}
              <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white shadow-md text-xs font-mono font-bold">
                <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{Math.round(rotation)}°</span>
                <span className="text-[10px] text-amber-300 font-sans ml-1 font-semibold">
                  (Drag to Spin)
                </span>
              </div>

              {/* Angle Preset Toggles */}
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-0.5 rounded-full border border-[#E8E0D5] shadow-sm">
                <button
                  onClick={() => setIsAutoSpin(!isAutoSpin)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                    isAutoSpin
                      ? 'bg-[#5C3A21] text-white shadow-xs'
                      : 'text-[#5C3A21] hover:bg-amber-100'
                  }`}
                  title="Toggle Auto Spin"
                >
                  {isAutoSpin ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isAutoSpin ? 'Spinning' : 'Spin 360°'}</span>
                </button>

                <button
                  onClick={() => setTilt(tilt === 0 ? 28 : 0)}
                  className="px-2 py-1 rounded-full text-[11px] font-bold text-[#5C3A21] hover:bg-amber-100 flex items-center gap-1 transition-all"
                  title="Toggle 3D Angle vs Top View"
                >
                  <Eye className="w-3 h-3" />
                  <span>{tilt === 0 ? 'Top View' : '3D View'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. CUSTOMIZER TABS                                       */}
          {/* ======================================================== */}
          <div className="flex bg-[#EFE9DF] p-1 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab('toppings')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'toppings'
                  ? 'bg-white text-[#241A14] shadow-sm'
                  : 'text-[#665A4F] hover:text-[#241A14]'
              }`}
            >
              <span>🧀 Fresh Toppings ({selectedToppings.length})</span>
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
                <span className="text-xs font-extrabold text-[#241A14]">
                  Tap ingredients to drop onto 360° pizza:
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
                          ? 'bg-amber-50/95 text-[#241A14] border-[#E58A3A] shadow-md ring-2 ring-[#E58A3A]/40'
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
