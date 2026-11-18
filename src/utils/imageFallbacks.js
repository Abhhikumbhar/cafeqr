// Curated verified aesthetic cafe food photos (Unsplash CDN with direct CORS support)
export const CURATED_FOOD_IMAGES = [
  {
    name: 'Mango Shake',
    icon: '🥭',
    url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Thick Milkshake',
    icon: '🥤',
    url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Cold Coffee',
    icon: '🧋',
    url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Special Kadak Chai',
    icon: '☕',
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Espresso / Cappuccino',
    icon: '☕',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Cheese Pizza',
    icon: '🍕',
    url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Veg Loaded Burger',
    icon: '🍔',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Grilled Club Sandwich',
    icon: '🥪',
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'French Fries',
    icon: '🍟',
    url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Choco Brownie / Cake',
    icon: '🍫',
    url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80'
  }
];

export const CATEGORY_FALLBACKS = {
  Coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
  Tea: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
  Pizza: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
  Burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
  Sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
  "Cold Drinks": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
  Desserts: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
  Snacks: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80"
};

// Clean, parse, and unwrap image URLs (including Google Images redirects)
export const sanitizeImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let clean = rawUrl.trim().replace(/^["']|["']$/g, '');

  if (!clean) return '';

  // 1. If it's a data URL, return directly
  if (clean.startsWith('data:image/')) {
    return clean;
  }

  // 2. If it's a Google Images viewer redirect (google.com/imgres?imgurl=...)
  try {
    if (clean.includes('google.') && clean.includes('imgurl=')) {
      const parsed = new URL(clean);
      const direct = parsed.searchParams.get('imgurl');
      if (direct) {
        clean = decodeURIComponent(direct);
      }
    }
  } catch {
    const match = clean.match(/[?&]imgurl=([^&]+)/);
    if (match && match[1]) {
      clean = decodeURIComponent(match[1]);
    }
  }

  // 3. Ensure valid web protocol
  if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('data:') && !clean.startsWith('/')) {
    clean = `https://${clean}`;
  }

  return clean;
};

// Smart fallback resolver that checks dish name keyword and category
export const getItemFallbackImage = (item) => {
  const name = (typeof item === 'string' ? item : item?.name || '').toLowerCase();
  
  if (name.includes('mango') || name.includes('shake') || name.includes('smoothie') || name.includes('juice')) {
    return 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('chai') || name.includes('tea')) {
    return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('coffee') || name.includes('latte') || name.includes('cappuccino') || name.includes('brew')) {
    return 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('pizza')) {
    return 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('burger')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('sandwich')) {
    return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('fries') || name.includes('snack') || name.includes('nugget')) {
    return 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('brownie') || name.includes('cake') || name.includes('pastry') || name.includes('dessert') || name.includes('sweet')) {
    return 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80';
  }

  const cat = typeof item === 'object' ? item?.category : null;
  return CATEGORY_FALLBACKS[cat] || CATEGORY_FALLBACKS.Coffee;
};

// Compress and convert local uploaded image file to lightweight Base64
export const compressImageFile = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};
