// Sairam Chahawala Clean Initial Data
export const INITIAL_SETTINGS = {
  cafeName: "Sairam Chahawala",
  tagline: "Specialty Tea, Refreshments & Snacks",
  address: "Shop No. 1, Main Road, Maharashtra",
  phone: "+91 98765 43210",
  email: "contact@sairamchahawala.com",
  gstNumber: "27AAAAA0000A1Z5",
  gstPercentage: 5,
  tableCount: 10,
  currency: "₹",
  voiceEnabled: true,
  voiceVolume: 1.0,
  voicePitch: 1.0,
  voiceRate: 1.0,
  minOrderForLoyalty: 100,
  fifthVisitDiscount: 30,
  adminPin: "1234",
  demoMode: false,
  qrBaseUrl: "", // Optional live domain for printing permanent QR codes
};

// Exactly 10 Permanent Tables for Sairam Chahawala
export const INITIAL_TABLES = [
  { id: "T-01", number: 1, name: "Table 01", capacity: 2, status: "Available", activeOrderId: null, qrCodeData: "Table-01" },
  { id: "T-02", number: 2, name: "Table 02", capacity: 4, status: "Available", activeOrderId: null, qrCodeData: "Table-02" },
  { id: "T-03", number: 3, name: "Table 03", capacity: 2, status: "Available", activeOrderId: null, qrCodeData: "Table-03" },
  { id: "T-04", number: 4, name: "Table 04", capacity: 6, status: "Available", activeOrderId: null, qrCodeData: "Table-04" },
  { id: "T-05", number: 5, name: "Table 05", capacity: 4, status: "Available", activeOrderId: null, qrCodeData: "Table-05" },
  { id: "T-06", number: 6, name: "Table 06", capacity: 2, status: "Available", activeOrderId: null, qrCodeData: "Table-06" },
  { id: "T-07", number: 7, name: "Table 07", capacity: 4, status: "Available", activeOrderId: null, qrCodeData: "Table-07" },
  { id: "T-08", number: 8, name: "Table 08", capacity: 2, status: "Available", activeOrderId: null, qrCodeData: "Table-08" },
  { id: "T-09", number: 9, name: "Table 09", capacity: 6, status: "Available", activeOrderId: null, qrCodeData: "Table-09" },
  { id: "T-10", number: 10, name: "Table 10", capacity: 4, status: "Available", activeOrderId: null, qrCodeData: "Table-10" }
];

export const CATEGORIES = [
  "All",
  "Tea & Chai",
  "Coffee",
  "Bakery & Bun Maska",
  "Breakfast & Snacks",
  "Cold Drinks",
  "Desserts"
];

// Clean Real Menu for Sairam Chahawala
export const INITIAL_MENU_ITEMS = [
  // TEA & CHAI
  {
    id: "M-TEA-01",
    name: "Special Kadak Chai",
    category: "Tea & Chai",
    price: 15,
    description: "Signature strong brewed Indian milk tea with freshly ground spices.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    prepTime: "3 mins"
  },
  {
    id: "M-TEA-02",
    name: "Masala Chai",
    category: "Tea & Chai",
    price: 20,
    description: "Aromatic tea infused with crushed ginger, cardamom, cinnamon and clove.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    prepTime: "4 mins"
  },
  {
    id: "M-TEA-03",
    name: "Ginger Lemon Tea",
    category: "Tea & Chai",
    price: 20,
    description: "Light refreshing black tea brewed with fresh lemon juice and ginger.",
    isVeg: true,
    isBestseller: false,
    available: true,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80",
    prepTime: "3 mins"
  },

  // COFFEE
  {
    id: "M-COF-01",
    name: "Filter Coffee",
    category: "Coffee",
    price: 25,
    description: "Traditional frothy South Indian style chicory blend filter coffee.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    prepTime: "3 mins"
  },
  {
    id: "M-COF-02",
    name: "Chilled Cold Coffee",
    category: "Coffee",
    price: 50,
    description: "Thick creamy blended cold coffee topped with chocolate dusting.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
    prepTime: "4 mins"
  },

  // BAKERY & BUN MASKA
  {
    id: "M-BN-01",
    name: "Classic Bun Maska",
    category: "Bakery & Bun Maska",
    price: 35,
    description: "Soft fresh bun slathered with wholesome Amul butter. Perfect with Chai.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    prepTime: "2 mins"
  },
  {
    id: "M-BN-02",
    name: "Bun Maska with Mixed Fruit Jam",
    category: "Bakery & Bun Maska",
    price: 40,
    description: "Fresh pav bun with generous butter and sweet mixed fruit jam.",
    isVeg: true,
    isBestseller: false,
    available: true,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
    prepTime: "2 mins"
  },
  {
    id: "M-BN-03",
    name: "Crispy Cream Roll (2 Pcs)",
    category: "Bakery & Bun Maska",
    price: 25,
    description: "Flaky puff pastry horn stuffed with sweet vanilla bakery cream.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
    prepTime: "1 min"
  },

  // BREAKFAST & SNACKS
  {
    id: "M-SNK-01",
    name: "Kanda Poha",
    category: "Breakfast & Snacks",
    price: 30,
    description: "Traditional Maharashtrian flattened rice cooked with onions, peanuts and fresh coriander.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
    prepTime: "5 mins"
  },
  {
    id: "M-SNK-02",
    name: "Hot Samosa (2 Pcs)",
    category: "Breakfast & Snacks",
    price: 35,
    description: "Crispy golden fried samosas filled with spiced potatoes and green peas.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    prepTime: "3 mins"
  },
  {
    id: "M-SNK-03",
    name: "Batata Vada Pav",
    category: "Breakfast & Snacks",
    price: 20,
    description: "Classic spiced potato fritter in fresh pav with garlic chutney.",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80",
    prepTime: "3 mins"
  },

  // COLD DRINKS
  {
    id: "M-DRK-01",
    name: "Fresh Lemon Soda",
    category: "Cold Drinks",
    price: 30,
    description: "Fizzy chilled soda with fresh lemon juice, cumin and black salt (Sweet & Salty).",
    isVeg: true,
    isBestseller: true,
    available: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    prepTime: "2 mins"
  },
  {
    id: "M-DRK-02",
    name: "Packaged Mineral Water (1L)",
    category: "Cold Drinks",
    price: 20,
    description: "Chilled purified mineral water bottle.",
    isVeg: true,
    isBestseller: false,
    available: true,
    image: "https://images.unsplash.com/photo-1559839914-ba2ac5cd76e2?w=600&auto=format&fit=crop&q=80",
    prepTime: "1 min"
  }
];

// Clean 0 Customers (Real customers will be added as they visit)
export const INITIAL_CUSTOMERS = [];

// Clean 0 Orders (Real orders will appear when placed)
export const INITIAL_ORDERS = [];

// Clean Active Coupons
export const INITIAL_COUPONS = [
  { code: "CHAI10", discountPercent: 10, maxDiscount: 50, minBill: 100, description: "10% off on orders above ₹100", active: true },
  { code: "SAIRAM20", discount: 20, minBill: 150, description: "₹20 flat discount on bill above ₹150", active: true }
];
