// Atelier Nord — Contemporary Clothing & Essentials
// Pure JavaScript Architecture (No TypeScript)

import { PRODUCTS, VALID_COUPONS, PINCODE_DATABASE, DEMO_PROFILES } from './products.js';

// Application State
const state = {
  currentPage: 'home',
  selectedProductId: 'prod-01',
  searchQuery: '',
  selectedCategory: 'All',
  selectedSizes: [],
  selectedColors: [],
  priceMax: 10000,
  inStockOnly: false,
  sortBy: 'featured',
  viewMode: 'grid', // 'grid' | 'compact' | 'list'
  
  // Cart & Wishlist with localStorage persistence
  cart: JSON.parse(localStorage.getItem('atelier_js_cart') || 'null') || [
    {
      id: 'prod-01-L-Obsidian Black',
      productId: 'prod-01',
      selectedSize: 'L',
      selectedColor: { name: 'Obsidian Black', hex: '#1C1917' },
      quantity: 1,
      unitPrice: 3899
    },
    {
      id: 'prod-03-M-Raw Deep Indigo',
      productId: 'prod-03',
      selectedSize: 'M',
      selectedColor: { name: 'Raw Deep Indigo', hex: '#1A237E' },
      quantity: 1,
      unitPrice: 4999
    }
  ],
  
  wishlist: JSON.parse(localStorage.getItem('atelier_js_wishlist') || 'null') || ['prod-02', 'prod-05'],
  appliedCoupon: null,
  currentUser: DEMO_PROFILES.shopper,
  orders: [],
  lastOrder: null
};

// Calculations Helper
function calculateTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  
  let discountAmount = 0;
  if (state.appliedCoupon && subtotal >= state.appliedCoupon.minOrder) {
    if (state.appliedCoupon.discountType === 'percent') {
      discountAmount = Math.round((subtotal * state.appliedCoupon.value) / 100);
    } else {
      discountAmount = Math.min(subtotal, state.appliedCoupon.value);
    }
  }

  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const totalGst = Math.round(taxableSubtotal * 0.18); // 18% standard GST
  const cgst = Math.round(totalGst / 2); // 9%
  const sgst = totalGst - cgst; // 9%
  const shipping = (taxableSubtotal >= 2999 || taxableSubtotal === 0) ? 0 : 149;
  const grandTotal = taxableSubtotal + totalGst + shipping;

  return {
    subtotal,
    discountAmount,
    taxableSubtotal,
    totalGst,
    cgst,
    sgst,
    shipping,
    grandTotal,
    amountNeededForFreeShipping: Math.max(0, 2999 - taxableSubtotal)
  };
}

// Toast Feedback System
function showToast(title, description = '', type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-start gap-3 p-4 bg-[#26201B] text-[#FAF7F2] rounded-xl shadow-xl border border-[#3D332A] transition-all duration-300';
  
  const icon = type === 'success' ? '✓' : (type === 'error' ? '!' : 'ℹ');
  const iconColor = type === 'success' ? 'text-emerald-400' : (type === 'error' ? 'text-rose-400' : 'text-amber-400');

  toast.innerHTML = `
    <div class="shrink-0 mt-0.5 font-bold ${iconColor}">${icon}</div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold tracking-tight leading-snug">${title}</p>
      ${description ? `<p class="text-xs text-[#B5ABA0] mt-0.5">${description}</p>` : ''}
    </div>
    <button type="button" class="text-[#8C8072] hover:text-[#FAF7F2] p-1 -mr-1">✕</button>
  `;

  toast.querySelector('button').addEventListener('click', () => toast.remove());
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// State Persistence
function persistState() {
  localStorage.setItem('atelier_js_cart', JSON.stringify(state.cart));
  localStorage.setItem('atelier_js_wishlist', JSON.stringify(state.wishlist));
  updateHeaderBadges();
}

function updateHeaderBadges() {
  const totalCartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById('cart-badge');
  const mobileCartCount = document.getElementById('mobile-cart-count');
  if (cartBadge) cartBadge.textContent = totalCartCount;
  if (mobileCartCount) mobileCartCount.textContent = totalCartCount;

  const wishlistBadge = document.getElementById('wishlist-badge');
  const mobileWishlistCount = document.getElementById('mobile-wishlist-count');
  if (wishlistBadge) {
    wishlistBadge.textContent = state.wishlist.length;
    wishlistBadge.classList.toggle('hidden', state.wishlist.length === 0);
  }
  if (mobileWishlistCount) {
    mobileWishlistCount.textContent = state.wishlist.length;
  }
}

// Navigation Router
function navigateTo(page, params = {}) {
  state.currentPage = page;
  if (params.category) state.selectedCategory = params.category;
  if (params.productId) state.selectedProductId = params.productId;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderView();
}

// View Renderer Router
function renderView() {
  const viewport = document.getElementById('app-viewport');
  if (!viewport) return;

  updateHeaderBadges();

  switch (state.currentPage) {
    case 'home':
      viewport.innerHTML = renderHomePage();
      bindHomePageEvents();
      break;
    case 'shop':
      viewport.innerHTML = renderShopPage();
      bindShopPageEvents();
      break;
    case 'product':
      viewport.innerHTML = renderProductPage();
      bindProductPageEvents();
      break;
    case 'wishlist':
      viewport.innerHTML = renderWishlistPage();
      bindWishlistPageEvents();
      break;
    case 'cart':
      viewport.innerHTML = renderCartPage();
      bindCartPageEvents();
      break;
    case 'checkout':
      viewport.innerHTML = renderCheckoutPage();
      bindCheckoutPageEvents();
      break;
    case 'order-confirmed':
      viewport.innerHTML = renderOrderConfirmedPage();
      bindOrderConfirmedPageEvents();
      break;
    case 'auth':
      viewport.innerHTML = renderAuthPage();
      bindAuthPageEvents();
      break;
    default:
      viewport.innerHTML = renderHomePage();
      bindHomePageEvents();
  }
}

// PAGE 1: HOME PAGE
function renderHomePage() {
  const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, 4);

  return `
    <div class="space-y-16 sm:space-y-24 pb-16">
      <!-- 1. Storefront Hero Upper Part: Warm Natural Stone & Raw Linen Palette -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#EAE4D9] via-[#EFEAE2] to-[#FAF7F2] border-b border-[#E0D8CB] text-[#26201B]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div class="lg:col-span-5 space-y-6">
              <div class="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#736657]">
                <span>Winter 2026 Collection</span>
                <span aria-hidden="true">·</span>
                <span>Vol. 04</span>
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-display leading-[1.08] text-[#26201B]">
                Architectural Form. Heavy Drape.
              </h1>
              <p class="text-sm sm:text-base text-[#4D4338] leading-relaxed max-w-lg">
                Crafted in limited small-batch runs using 480 GSM organic cotton, Italian virgin wool, and Japanese shuttle-loom denim. Designed with human proportion and timeless tactility.
              </p>
              <div class="flex flex-wrap items-center gap-3 pt-2">
                <button type="button" id="hero-explore-btn" class="px-6 py-3.5 bg-[#26201B] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#3B322B] transition-all flex items-center gap-2 shadow-sm">
                  <span>Explore Collection</span> →
                </button>
                <button type="button" id="hero-outerwear-btn" class="px-6 py-3.5 bg-white/80 text-[#302821] border border-[#DDD5C7] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-white transition-colors">
                  Outerwear Drops
                </button>
              </div>
              <div class="pt-4 border-t border-[#DDD5C7] flex items-center gap-6 text-xs text-[#5C5144]">
                <div><span class="block font-bold text-[#26201B] font-mono text-base">480 GSM</span><span class="text-[11px]">Dense Loopback Cotton</span></div>
                <div class="w-px h-8 bg-[#DDD5C7]"></div>
                <div><span class="block font-bold text-[#26201B] font-mono text-base">14-Day</span><span class="text-[11px]">Free Home Exchanges</span></div>
                <div class="w-px h-8 bg-[#DDD5C7]"></div>
                <div><span class="block font-bold text-[#26201B] font-mono text-base">18% GST</span><span class="text-[11px]">Tax Invoice Included</span></div>
              </div>
            </div>
            <div class="lg:col-span-7">
              <div class="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] bg-[#E3DDD1] border border-[#DDD5C7]">
                <img src="/src/assets/images/hero_fashion_editorial_1794503146771.jpg" alt="Atelier Nord editorial" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-[#26201B]/50 via-transparent to-transparent pointer-events-none"></div>
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#FAF7F2]">
                  <span class="font-medium tracking-wide">Studio Lookbook · Campaign 04</span>
                  <span class="text-white/80">Bengaluru & Milan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Curated Categories -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-[#736657] mb-1">Wardrobe Series</div>
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#26201B] font-display">Shop by Focus</h2>
          </div>
          <button type="button" id="home-view-all-categories-btn" class="text-xs font-semibold uppercase tracking-wider text-[#26201B] hover:text-[#5C5144]">View All →</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div data-cat="Outerwear" class="cat-card group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#E8E2D6] cursor-pointer border border-[#DDD5C7]">
            <img src="/src/assets/images/product_wool_overcoat_1794503147460.jpg" alt="Outerwear" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-[#26201B]/85 via-[#26201B]/20 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 p-6 text-white">
              <span class="text-[11px] font-semibold uppercase text-[#EAE4DA]">Outerwear</span>
              <h3 class="text-xl font-bold font-display text-white mt-1">Trench Coats & Heavy Hoodies</h3>
              <p class="text-xs text-[#EAE4DA] mt-1">Explore items →</p>
            </div>
          </div>
          <div data-cat="Knitwear" class="cat-card group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#E8E2D6] cursor-pointer border border-[#DDD5C7]">
            <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80" alt="Knitwear" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-[#26201B]/85 via-[#26201B]/20 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 p-6 text-white">
              <span class="text-[11px] font-semibold uppercase text-[#EAE4DA]">Knitwear</span>
              <h3 class="text-xl font-bold font-display text-white mt-1">19.5μ Merino & Cashmere</h3>
              <p class="text-xs text-[#EAE4DA] mt-1">Explore items →</p>
            </div>
          </div>
          <div data-cat="Essentials" class="cat-card group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#E8E2D6] cursor-pointer border border-[#DDD5C7]">
            <img src="/src/assets/images/product_selvedge_denim_1794503147242.jpg" alt="Essentials" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-[#26201B]/85 via-[#26201B]/20 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 p-6 text-white">
              <span class="text-[11px] font-semibold uppercase text-[#EAE4DA]">Essentials</span>
              <h3 class="text-xl font-bold font-display text-white mt-1">Japanese Selvedge Denim</h3>
              <p class="text-xs text-[#EAE4DA] mt-1">Explore items →</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Featured Products Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-[#736657] mb-1">Winter Capsule</div>
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#26201B] font-display">Featured Signature Pieces</h2>
          </div>
          <button type="button" id="home-view-catalog-btn" class="text-xs font-semibold uppercase tracking-wider text-[#26201B] hover:text-[#5C5144]">Full Catalog (12) →</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${featured.map(p => renderProductCardHTML(p)).join('')}
        </div>
      </section>

      <!-- 4. Craftsmanship Section -->
      <section class="bg-[#EFEAE2] py-16 border-y border-[#E2DAD0]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <div class="text-xs font-semibold uppercase tracking-wider text-[#736657]">The Material Philosophy</div>
              <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-[#26201B] font-display text-balance">
                Zero synthetic fillers. Every fiber chosen for weight and endurance.
              </h2>
              <p class="text-sm text-[#4D4338] leading-relaxed">
                Conventional fast fashion relies on poly-blends that pill, fray, and lose shape within weeks. Atelier Nord partners directly with heritage mills across Japan, Italy, and South India to produce dense single-origin textiles.
              </p>
              <div class="grid grid-cols-2 gap-4 pt-2">
                <div class="p-4 bg-white/90 rounded-xl border border-[#DDD5C7] shadow-2xs">
                  <span class="text-xl font-bold font-mono text-[#26201B] block">480 GSM</span>
                  <span class="text-xs text-[#5C5144] mt-1 block">Loopback French terry</span>
                </div>
                <div class="p-4 bg-white/90 rounded-xl border border-[#DDD5C7] shadow-2xs">
                  <span class="text-xl font-bold font-mono text-[#26201B] block">100% GOTS</span>
                  <span class="text-xs text-[#5C5144] mt-1 block">Certified toxic-free dyes</span>
                </div>
              </div>
            </div>
            <div class="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#E3DDD1] border border-[#DDD5C7]">
              <img src="/src/assets/images/product_luxury_hoodie_1794503147589.jpg" alt="Craftsmanship" class="w-full h-full object-cover">
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function bindHomePageEvents() {
  document.getElementById('hero-explore-btn')?.addEventListener('click', () => navigateTo('shop', { category: 'All' }));
  document.getElementById('hero-outerwear-btn')?.addEventListener('click', () => navigateTo('shop', { category: 'Outerwear' }));
  document.getElementById('home-view-all-categories-btn')?.addEventListener('click', () => navigateTo('shop', { category: 'All' }));
  document.getElementById('home-view-catalog-btn')?.addEventListener('click', () => navigateTo('shop', { category: 'All' }));

  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-cat');
      navigateTo('shop', { category: cat });
    });
  });

  bindCardClickEvents();
}

// Product Card HTML Generator
function renderProductCardHTML(p) {
  const isWishlisted = state.wishlist.includes(p.id);
  const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

  return `
    <div class="product-card group relative flex flex-col bg-[#FDFBF7] rounded-xl border border-[#E8E1D5] overflow-hidden hover:border-[#D5CABE] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer" data-id="${p.id}">
      <div class="relative aspect-[3/4] w-full bg-[#EFEAE1] overflow-hidden">
        <img src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          ${p.isNew ? '<span class="text-[11px] font-semibold uppercase text-[#26201B] bg-[#FAF7F2]/90 px-2 py-0.5 rounded-sm shadow-2xs">New Drop</span>' : ''}
          ${!p.isNew && discountPercent > 0 ? `<span class="text-[11px] font-semibold uppercase text-[#2D5A38] bg-[#E8F1EB]/95 px-2 py-0.5 rounded-sm">${discountPercent}% Off</span>` : ''}
        </div>
        <button type="button" class="btn-card-wishlist absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-2xs ${isWishlisted ? 'bg-[#A84236] text-white' : 'bg-[#FAF7F2]/90 text-[#4D4339] hover:bg-white'}" data-id="${p.id}" aria-label="Wishlist">
          ♥
        </button>
      </div>
      <div class="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <div class="flex items-center justify-between text-xs text-[#736657] mb-1">
            <span class="uppercase tracking-wider text-[11px] font-medium">${p.category} · ${p.subCategory}</span>
            <span class="text-[#26201B] font-mono text-[11px] font-semibold">★ ${p.rating.toFixed(1)}</span>
          </div>
          <h4 class="text-sm font-semibold text-[#26201B] group-hover:text-[#5C5144] transition-colors line-clamp-1">${p.name}</h4>
          <div class="flex items-center gap-1.5 mt-2">
            ${p.colors.map(c => `<span style="background-color: ${c.hex}" class="w-3.5 h-3.5 rounded-full inline-block ${c.border ? 'border border-[#DDD5C7]' : ''}" title="${c.name}"></span>`).join('')}
            <span class="text-[11px] text-[#8C8072] ml-1">${p.colors.length} colors</span>
          </div>
        </div>
        <div class="pt-2 border-t border-[#EFEAE1] flex items-baseline justify-between">
          <div class="flex items-baseline gap-2">
            <span class="text-base font-bold text-[#26201B] tabular-nums font-mono">₹${p.price.toLocaleString('en-IN')}</span>
            ${p.originalPrice > p.price ? `<span class="text-xs text-[#8C8072] line-through tabular-nums font-mono">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <span class="text-[10px] text-[#8C8072] uppercase">Incl. GST</span>
        </div>
      </div>
    </div>
  `;
}

function bindCardClickEvents() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked wishlist button
      if (e.target.closest('.btn-card-wishlist')) return;
      const id = card.getAttribute('data-id');
      navigateTo('product', { productId: id });
    });
  });

  document.querySelectorAll('.btn-card-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      toggleWishlistItem(id);
    });
  });
}

function toggleWishlistItem(id) {
  const exists = state.wishlist.includes(id);
  const p = PRODUCTS.find(x => x.id === id);
  if (exists) {
    state.wishlist = state.wishlist.filter(x => x !== id);
    showToast('Removed from Wishlist', p?.name, 'info');
  } else {
    state.wishlist.push(id);
    showToast('Saved to Wishlist', p?.name, 'success');
  }
  persistState();
  renderView();
}

// PAGE 2: SHOP CATALOG (Full Filter by size, colour, price, sort)
function renderShopPage() {
  // Filtering logic
  let filtered = PRODUCTS.filter(p => {
    if (state.selectedCategory !== 'All' && p.category !== state.selectedCategory) return false;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const match = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (p.price > state.priceMax) return false;
    if (state.selectedSizes.length > 0) {
      const hasSize = state.selectedSizes.some(s => p.sizes.includes(s));
      if (!hasSize) return false;
    }
    if (state.selectedColors.length > 0) {
      const hasColor = state.selectedColors.some(c => p.colors.some(pc => pc.matchKey === c));
      if (!hasColor) return false;
    }
    if (state.inStockOnly && (!p.inStock || p.stockCount <= 0)) return false;
    return true;
  });

  // Sorting logic
  filtered.sort((a, b) => {
    if (state.sortBy === 'price-asc') return a.price - b.price;
    if (state.sortBy === 'price-desc') return b.price - a.price;
    if (state.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (state.sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const categories = ['All', 'Outerwear', 'Knitwear', 'Essentials', 'Men', 'Women', 'Unisex'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { label: 'Black', key: 'black', hex: '#1C1917' },
    { label: 'Charcoal', key: 'charcoal', hex: '#3F3F46' },
    { label: 'Camel', key: 'camel', hex: '#B87B44' },
    { label: 'Indigo', key: 'indigo', hex: '#1A237E' },
    { label: 'White', key: 'white', hex: '#F8FAFC', border: true },
    { label: 'Olive', key: 'olive', hex: '#4B553D' },
    { label: 'Terracotta', key: 'terracotta', hex: '#9C4131' },
    { label: 'Navy', key: 'navy', hex: '#1E293B' }
  ];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E1D5]">
        <div>
          <div class="text-xs font-semibold uppercase tracking-wider text-[#736657] mb-1">
            Contemporary Catalog · ${filtered.length} of ${PRODUCTS.length} Styles
          </div>
          <h1 class="text-3xl font-bold font-display tracking-tight text-[#26201B]">
            ${state.selectedCategory === 'All' ? 'All Collections' : `${state.selectedCategory} Collection`}
          </h1>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <select id="shop-sort-select" class="pl-3 pr-8 py-2 text-xs font-semibold bg-white border border-[#DDD5C7] rounded-lg text-[#26201B] cursor-pointer">
              <option value="featured" ${state.sortBy === 'featured' ? 'selected' : ''}>Sort by: Featured</option>
              <option value="newest" ${state.sortBy === 'newest' ? 'selected' : ''}>Sort by: Newest Drops</option>
              <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${state.sortBy === 'rating' ? 'selected' : ''}>Top Customer Rated</option>
            </select>
          </div>
          <button type="button" id="shop-reset-filters-btn" class="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100">
            Reset Filters
          </button>
        </div>
      </div>

      <!-- Main Layout: Sidebar Filters + Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
        <!-- Sidebar Filter -->
        <aside class="space-y-6 lg:sticky lg:top-24 self-start">
          <!-- Categories -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-[#26201B] block mb-2">Category</label>
            <div class="flex flex-wrap lg:flex-col gap-1">
              ${categories.map(c => `
                <button type="button" class="filter-cat-btn text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors ${state.selectedCategory === c ? 'bg-[#26201B] text-[#FAF7F2] font-semibold' : 'text-[#5E5347] hover:bg-[#EFEAE1]'}" data-cat="${c}">
                  ${c}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Sizes -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-[#26201B] block mb-2">Filter by Size</label>
            <div class="grid grid-cols-3 gap-1.5">
              ${sizes.map(s => `
                <button type="button" class="filter-size-btn py-2 text-xs font-semibold rounded-lg border transition-all ${state.selectedSizes.includes(s) ? 'bg-[#26201B] text-[#FAF7F2] border-[#26201B]' : 'bg-white text-[#4D4339] border-[#DDD5C7] hover:border-[#26201B]'}" data-size="${s}">
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Colours -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-[#26201B] block mb-2">Filter by Colour</label>
            <div class="grid grid-cols-2 gap-1.5">
              ${colors.map(col => `
                <button type="button" class="filter-color-btn flex items-center gap-2 p-1.5 rounded-lg border text-xs transition-all ${state.selectedColors.includes(col.key) ? 'bg-[#EFEAE1] border-[#26201B] font-semibold text-[#26201B]' : 'bg-white border-[#DDD5C7] text-[#5E5347]'}" data-color="${col.key}">
                  <span style="background-color: ${col.hex}" class="w-3.5 h-3.5 rounded-full shrink-0 ${col.border ? 'border border-[#DDD5C7]' : ''}"></span>
                  <span class="truncate">${col.label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Price Range Slider -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-xs font-bold uppercase tracking-wider text-[#26201B]">Price Ceiling</label>
              <span class="text-xs font-bold font-mono text-[#26201B]">Up to ₹${state.priceMax.toLocaleString('en-IN')}</span>
            </div>
            <input type="range" id="shop-price-slider" min="1500" max="10000" step="500" value="${state.priceMax}" class="w-full accent-[#26201B] cursor-pointer">
            <div class="flex justify-between text-[11px] text-[#8C8072] font-mono mt-1">
              <span>₹1,500</span>
              <span>₹10,000+</span>
            </div>
          </div>

          <!-- In-Stock Checkbox -->
          <div>
            <label class="flex items-center gap-2 text-xs font-medium text-[#4D4339] cursor-pointer">
              <input type="checkbox" id="shop-instock-checkbox" ${state.inStockOnly ? 'checked' : ''} class="w-4 h-4 rounded border-[#DDD5C7] text-[#26201B] accent-[#26201B]">
              <span>In-Stock Pieces Only</span>
            </label>
          </div>
        </aside>

        <!-- Product Grid -->
        <main class="lg:col-span-3">
          ${filtered.length === 0 ? `
            <div class="text-center py-20 bg-white rounded-2xl border border-[#E8E1D5]">
              <h3 class="text-lg font-bold font-display text-[#26201B]">No garments match your filters</h3>
              <p class="text-xs text-[#8C8072] mt-1">Loosen size or color filters to view available pieces.</p>
              <button type="button" id="empty-reset-filters-btn" class="mt-4 px-4 py-2 bg-[#26201B] text-[#FAF7F2] text-xs font-semibold rounded-lg">Clear All Filters</button>
            </div>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              ${filtered.map(p => renderProductCardHTML(p)).join('')}
            </div>
          `}
        </main>
      </div>
    </div>
  `;
}

function bindShopPageEvents() {
  document.getElementById('shop-sort-select')?.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderView();
  });

  document.getElementById('shop-price-slider')?.addEventListener('input', (e) => {
    state.priceMax = Number(e.target.value);
    renderView();
  });

  document.getElementById('shop-instock-checkbox')?.addEventListener('change', (e) => {
    state.inStockOnly = e.target.checked;
    renderView();
  });

  document.getElementById('shop-reset-filters-btn')?.addEventListener('click', resetAllShopFilters);
  document.getElementById('empty-reset-filters-btn')?.addEventListener('click', resetAllShopFilters);

  document.querySelectorAll('.filter-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedCategory = btn.getAttribute('data-cat');
      renderView();
    });
  });

  document.querySelectorAll('.filter-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.getAttribute('data-size');
      if (state.selectedSizes.includes(size)) {
        state.selectedSizes = state.selectedSizes.filter(s => s !== size);
      } else {
        state.selectedSizes.push(size);
      }
      renderView();
    });
  });

  document.querySelectorAll('.filter-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      if (state.selectedColors.includes(color)) {
        state.selectedColors = state.selectedColors.filter(c => c !== color);
      } else {
        state.selectedColors.push(color);
      }
      renderView();
    });
  });

  bindCardClickEvents();
}

function resetAllShopFilters() {
  state.selectedCategory = 'All';
  state.searchQuery = '';
  state.selectedSizes = [];
  state.selectedColors = [];
  state.priceMax = 10000;
  state.inStockOnly = false;
  state.sortBy = 'featured';
  renderView();
}

// PAGE 3: PRODUCT DETAILS PAGE (PDP)
function renderProductPage() {
  const p = PRODUCTS.find(x => x.id === state.selectedProductId) || PRODUCTS[0];
  const isWishlisted = state.wishlist.includes(p.id);
  const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
      <!-- Breadcrumb -->
      <div class="text-xs text-[#736657] mb-6 flex items-center gap-2">
        <button type="button" id="pdp-back-btn" class="hover:underline">Home</button>
        <span>/</span>
        <button type="button" id="pdp-cat-btn" class="hover:underline">${p.category}</button>
        <span>/</span>
        <span class="text-[#26201B] font-bold">${p.name}</span>
      </div>

      <!-- Contiguous Purchase Module PDP -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Gallery Left (7 Cols) -->
        <div class="lg:col-span-7 space-y-4">
          <div class="aspect-[3/4] w-full bg-[#EFEAE1] rounded-2xl overflow-hidden border border-[#E8E1D5]">
            <img id="pdp-main-img" src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover">
          </div>
          ${p.images.length > 1 ? `
            <div class="grid grid-cols-4 gap-3">
              ${p.images.map((img, i) => `
                <button type="button" class="pdp-thumb-btn aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${i === 0 ? 'border-[#26201B]' : 'border-transparent opacity-70 hover:opacity-100'}" data-src="${img}">
                  <img src="${img}" alt="" class="w-full h-full object-cover">
                </button>
              `).join('')}
            </div>
          ` : ''}

          <!-- Fabric Specs & Care -->
          <div class="mt-8 pt-6 border-t border-[#E8E1D5] space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-[#26201B]">Textile Specifications</h3>
            <ul class="text-xs text-[#5E5347] space-y-2 list-disc list-inside">
              ${p.fabricDetails.map(item => `<li>${item}</li>`).join('')}
              <li><strong class="text-[#26201B]">HSN Code:</strong> ${p.hsnCode}</li>
            </ul>
          </div>
        </div>

        <!-- Purchase Module Right (5 Cols - Sticky) -->
        <div class="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E1D5] shadow-xs space-y-6">
            <div>
              <span class="text-xs uppercase tracking-wider text-[#736657] font-semibold">${p.category} · ${p.subCategory}</span>
              <h1 class="text-2xl sm:text-3xl font-bold font-display text-[#26201B] mt-1">${p.name}</h1>
              <div class="flex items-center gap-2 mt-2 text-xs">
                <span class="font-bold text-[#26201B] font-mono">★ ${p.rating.toFixed(2)}</span>
                <span class="text-[#8C8072]">(${p.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <div class="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] flex items-baseline justify-between">
              <div>
                <div class="flex items-baseline gap-3">
                  <span class="text-3xl font-bold font-mono text-[#26201B]">₹${p.price.toLocaleString('en-IN')}</span>
                  ${p.originalPrice > p.price ? `<span class="text-sm text-[#8C8072] line-through font-mono">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
                  ${discountPercent > 0 ? `<span class="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Save ${discountPercent}%</span>` : ''}
                </div>
                <span class="text-[11px] text-[#8C8072] block mt-1">Includes 18% GST (itemized on tax invoice)</span>
              </div>
            </div>

            <!-- Color selection -->
            <div>
              <label class="text-xs font-bold uppercase tracking-wider text-[#26201B] block mb-2">Select Color</label>
              <div class="flex items-center gap-3">
                ${p.colors.map((c, i) => `
                  <button type="button" class="pdp-color-btn flex items-center gap-2 p-1.5 pr-3 rounded-full border text-xs ${i === 0 ? 'border-[#26201B] bg-[#EFEAE1] font-semibold text-[#26201B]' : 'border-[#DDD5C7] text-[#5E5347]'}" data-color-name="${c.name}" data-color-hex="${c.hex}">
                    <span style="background-color: ${c.hex}" class="w-4 h-4 rounded-full ${c.border ? 'border border-[#DDD5C7]' : ''}"></span>
                    <span>${c.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Size selection -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold uppercase tracking-wider text-[#26201B]">Select Size</label>
                <button type="button" id="open-size-guide-pdp" class="text-xs font-semibold text-[#26201B] underline">Size Guide (cm/in)</button>
              </div>
              <div class="grid grid-cols-5 gap-2">
                ${p.sizes.map((s, i) => `
                  <button type="button" class="pdp-size-btn py-2.5 text-xs font-bold rounded-xl border transition-all ${i === 0 ? 'bg-[#26201B] text-[#FAF7F2] border-[#26201B]' : 'bg-white text-[#26201B] border-[#DDD5C7]'}" data-size="${s}">
                    ${s}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Quantity & Add to Cart -->
            <div class="space-y-3 pt-2">
              <div class="flex items-center gap-3">
                <div class="flex items-center border border-[#DDD5C7] rounded-xl overflow-hidden bg-[#FAF7F2]">
                  <button type="button" id="pdp-qty-minus" class="px-4 py-3 text-[#26201B] font-bold">-</button>
                  <span id="pdp-qty-val" class="px-4 py-3 text-xs font-bold font-mono bg-white min-w-[36px] text-center">1</span>
                  <button type="button" id="pdp-qty-plus" class="px-4 py-3 text-[#26201B] font-bold">+</button>
                </div>
                <button type="button" id="pdp-add-to-cart-btn" class="flex-1 py-3.5 px-6 bg-[#26201B] hover:bg-[#3B322B] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md">
                  Add to Bag
                </button>
                <button type="button" id="pdp-wishlist-toggle" class="p-3.5 rounded-xl border border-[#DDD5C7] ${isWishlisted ? 'bg-rose-50 text-rose-600 border-rose-400' : 'text-[#4D4339]'}">
                  ♥
                </button>
              </div>
            </div>

            <!-- 6-Digit PIN Code Delivery Speed Estimator -->
            <div class="pt-4 border-t border-[#E8E1D5] space-y-2.5">
              <label class="text-xs font-bold uppercase tracking-wider text-[#26201B] block">Check Delivery Speed (6-Digit PIN)</label>
              <div class="flex gap-2">
                <input type="text" id="pdp-pin-input" maxlength="6" placeholder="Enter 6-digit PIN (e.g. 560001)" class="w-full px-3 py-2 text-xs border border-[#DDD5C7] rounded-lg font-mono">
                <button type="button" id="pdp-pin-btn" class="px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFEAE1] border border-[#DDD5C7] text-[#26201B] text-xs font-semibold rounded-lg shrink-0">Check</button>
              </div>
              <div id="pdp-pin-result" class="text-xs"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindProductPageEvents() {
  const p = PRODUCTS.find(x => x.id === state.selectedProductId) || PRODUCTS[0];
  let selectedSize = p.sizes[0] || 'M';
  let selectedColor = p.colors[0];
  let quantity = 1;

  document.getElementById('pdp-back-btn')?.addEventListener('click', () => navigateTo('home'));
  document.getElementById('pdp-cat-btn')?.addEventListener('click', () => navigateTo('shop', { category: p.category }));

  // Gallery thumbnails
  document.querySelectorAll('.pdp-thumb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-src');
      document.getElementById('pdp-main-img').src = src;
      document.querySelectorAll('.pdp-thumb-btn').forEach(b => b.classList.remove('border-[#26201B]'));
      btn.classList.add('border-[#26201B]');
    });
  });

  // Size buttons
  document.querySelectorAll('.pdp-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSize = btn.getAttribute('data-size');
      document.querySelectorAll('.pdp-size-btn').forEach(b => {
        b.className = 'pdp-size-btn py-2.5 text-xs font-bold rounded-xl border transition-all bg-white text-[#26201B] border-[#DDD5C7]';
      });
      btn.className = 'pdp-size-btn py-2.5 text-xs font-bold rounded-xl border transition-all bg-[#26201B] text-[#FAF7F2] border-[#26201B]';
    });
  });

  // Color buttons
  document.querySelectorAll('.pdp-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = {
        name: btn.getAttribute('data-color-name'),
        hex: btn.getAttribute('data-color-hex')
      };
      document.querySelectorAll('.pdp-color-btn').forEach(b => {
        b.className = 'pdp-color-btn flex items-center gap-2 p-1.5 pr-3 rounded-full border text-xs border-[#DDD5C7] text-[#5E5347]';
      });
      btn.className = 'pdp-color-btn flex items-center gap-2 p-1.5 pr-3 rounded-full border text-xs border-[#26201B] bg-[#EFEAE1] font-semibold text-[#26201B]';
    });
  });

  // Quantity stepper
  document.getElementById('pdp-qty-minus')?.addEventListener('click', () => {
    quantity = Math.max(1, quantity - 1);
    document.getElementById('pdp-qty-val').textContent = quantity;
  });
  document.getElementById('pdp-qty-plus')?.addEventListener('click', () => {
    quantity++;
    document.getElementById('pdp-qty-val').textContent = quantity;
  });

  // Add to cart
  document.getElementById('pdp-add-to-cart-btn')?.addEventListener('click', () => {
    const cartItemId = `${p.id}-${selectedSize}-${selectedColor.name}`;
    const existing = state.cart.find(it => it.id === cartItemId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({
        id: cartItemId,
        productId: p.id,
        selectedSize,
        selectedColor,
        quantity,
        unitPrice: p.price
      });
    }
    persistState();
    showToast(`Added to Bag: ${p.name}`, `Size: ${selectedSize} · Color: ${selectedColor.name} (Qty: ${quantity})`, 'success');
  });

  // Wishlist button
  document.getElementById('pdp-wishlist-toggle')?.addEventListener('click', () => {
    toggleWishlistItem(p.id);
  });

  // Size guide trigger
  document.getElementById('open-size-guide-pdp')?.addEventListener('click', () => {
    document.getElementById('modal-size-guide')?.classList.remove('hidden');
  });

  // Pincode speed checker
  document.getElementById('pdp-pin-btn')?.addEventListener('click', () => {
    const pin = document.getElementById('pdp-pin-input')?.value.trim();
    const res = document.getElementById('pdp-pin-result');
    if (!res) return;

    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      res.innerHTML = '<span class="text-rose-600">Please enter a valid 6-digit Indian PIN code.</span>';
      return;
    }

    const info = PINCODE_DATABASE[pin] || { city: 'Your Location', state: 'Standard Metro Zone', days: 3 };
    res.innerHTML = `
      <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
        <p class="font-bold">✓ Delivery in ${info.days} business days to ${info.city}, ${info.state}</p>
        <p class="text-[11px] text-emerald-700">Eligible for Free Delivery & Cash on Delivery</p>
      </div>
    `;
  });
}

// PAGE 4: WISHLIST PAGE
function renderWishlistPage() {
  const wishlistProducts = PRODUCTS.filter(p => state.wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return `
      <div class="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 class="text-3xl font-bold font-display text-[#26201B]">Your Wishlist is Empty</h1>
        <p class="text-xs text-[#8C8072] mt-2">Save pieces while browsing to review fabric details and availability.</p>
        <button type="button" id="wishlist-browse-btn" class="mt-6 px-6 py-3 bg-[#26201B] text-[#FAF7F2] text-xs font-semibold rounded-xl">
          Discover Catalog →
        </button>
      </div>
    `;
  }

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="flex items-center justify-between pb-6 border-b border-[#E8E1D5]">
        <div>
          <span class="text-xs uppercase tracking-wider text-[#736657]">Saved Pieces</span>
          <h1 class="text-3xl font-bold font-display text-[#26201B]">${wishlistProducts.length} Saved Garments</h1>
        </div>
        <button type="button" id="clear-wishlist-btn" class="px-4 py-2 text-xs font-semibold border border-[#DDD5C7] rounded-lg text-[#26201B] hover:bg-[#EFEAE1]">
          Clear Wishlist
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
        ${wishlistProducts.map(p => `
          <div class="bg-white rounded-xl border border-[#E8E1D5] overflow-hidden flex flex-col justify-between">
            <div class="aspect-[3/4] bg-[#EFEAE1] relative">
              <img src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover">
              <button type="button" class="btn-remove-wishlist absolute top-3 right-3 p-2 bg-white/90 text-rose-600 rounded-full hover:bg-white" data-id="${p.id}">✕</button>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <span class="text-[11px] uppercase tracking-wider text-[#736657]">${p.category}</span>
                <h3 class="text-sm font-bold text-[#26201B] line-clamp-1">${p.name}</h3>
                <span class="text-sm font-bold font-mono text-[#26201B] block mt-1">₹${p.price.toLocaleString('en-IN')}</span>
              </div>
              <button type="button" class="btn-wishlist-move-to-cart w-full py-2 bg-[#26201B] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#3B322B]" data-id="${p.id}">
                Move to Bag
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function bindWishlistPageEvents() {
  document.getElementById('wishlist-browse-btn')?.addEventListener('click', () => navigateTo('shop'));
  document.getElementById('clear-wishlist-btn')?.addEventListener('click', () => {
    state.wishlist = [];
    persistState();
    showToast('Wishlist cleared', '', 'info');
    renderView();
  });

  document.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      toggleWishlistItem(id);
    });
  });

  document.querySelectorAll('.btn-wishlist-move-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const p = PRODUCTS.find(x => x.id === id);
      if (p) {
        state.cart.push({
          id: `${p.id}-${p.sizes[0]}-${p.colors[0].name}`,
          productId: p.id,
          selectedSize: p.sizes[0],
          selectedColor: p.colors[0],
          quantity: 1,
          unitPrice: p.price
        });
        state.wishlist = state.wishlist.filter(x => x !== id);
        persistState();
        showToast('Moved to Shopping Bag', p.name, 'success');
        renderView();
      }
    });
  });
}

// PAGE 5: CART PAGE (Quantity adjustment, Coupon, and 18% GST Breakdown)
function renderCartPage() {
  if (state.cart.length === 0) {
    return `
      <div class="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 class="text-3xl font-bold font-display text-[#26201B]">Your Shopping Bag is Empty</h1>
        <p class="text-xs text-[#8C8072] mt-2">Explore our heavyweight French terry and tailored wool drops.</p>
        <button type="button" id="cart-explore-btn" class="mt-6 px-6 py-3 bg-[#26201B] text-[#FAF7F2] text-xs font-semibold rounded-xl">
          Explore Catalog →
        </button>
      </div>
    `;
  }

  const totals = calculateTotals();
  const freeShippingProgress = Math.min(100, Math.round((totals.taxableSubtotal / 2999) * 100));

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="flex items-center justify-between pb-6 border-b border-[#E8E1D5]">
        <div>
          <span class="text-xs uppercase tracking-wider text-[#736657]">Review Order</span>
          <h1 class="text-3xl font-bold font-display text-[#26201B]">Shopping Bag & Tax Summary</h1>
        </div>
        <button type="button" id="cart-clear-btn" class="text-xs font-semibold text-rose-700 hover:underline">
          Clear Bag
        </button>
      </div>

      <!-- Free shipping progress bar -->
      <div class="my-6 p-4 bg-[#EFEAE1] rounded-xl border border-[#DDD5C7]">
        <div class="flex items-center justify-between text-xs font-semibold text-[#26201B] mb-2">
          <span>${totals.amountNeededForFreeShipping > 0 ? `Add <strong class="font-mono">₹${totals.amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more to unlock Free Express Delivery` : '<strong class="text-emerald-800">You unlocked Free Express Shipping!</strong>'}</span>
          <span class="font-mono">${freeShippingProgress}%</span>
        </div>
        <div class="w-full bg-[#DDD5C7] h-2 rounded-full overflow-hidden">
          <div style="width: ${freeShippingProgress}%" class="h-full bg-[#26201B] transition-all"></div>
        </div>
      </div>

      <!-- 2 Columns: Items + Order Totals -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Left: Items List -->
        <div class="lg:col-span-7 space-y-4">
          <div class="divide-y divide-[#E8E1D5] border border-[#E8E1D5] rounded-2xl bg-white overflow-hidden shadow-xs">
            ${state.cart.map(item => {
              const p = PRODUCTS.find(x => x.id === item.productId) || PRODUCTS[0];
              return `
                <div class="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div class="flex gap-4 items-center">
                    <img src="${p.images[0]}" alt="${p.name}" class="w-20 aspect-[3/4] object-cover bg-[#EFEAE1] rounded-lg">
                    <div>
                      <span class="text-[11px] uppercase tracking-wider text-[#736657]">${p.category}</span>
                      <h3 class="text-sm sm:text-base font-bold text-[#26201B] font-display">${p.name}</h3>
                      <div class="flex items-center gap-2 text-xs text-[#5E5347] mt-1">
                        <span class="px-2 py-0.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded font-semibold">Size: ${item.selectedSize}</span>
                        <span class="flex items-center gap-1.5 px-2 py-0.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded">
                          <span style="background-color: ${item.selectedColor.hex}" class="w-2.5 h-2.5 rounded-full ${item.selectedColor.border ? 'border border-[#DDD5C7]' : ''}"></span>
                          <span>${item.selectedColor.name}</span>
                        </span>
                      </div>
                      <span class="text-xs text-[#8C8072] font-mono block mt-1">₹${item.unitPrice.toLocaleString('en-IN')} each</span>
                    </div>
                  </div>
                  <div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <div class="text-right">
                      <span class="text-base font-bold font-mono text-[#26201B]">₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}</span>
                      <span class="text-[10px] text-[#8C8072] block">Incl. 18% GST</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="flex items-center border border-[#DDD5C7] rounded-lg overflow-hidden bg-[#FAF7F2]">
                        <button type="button" class="btn-cart-minus px-2.5 py-1 text-xs font-bold" data-id="${item.id}">-</button>
                        <span class="px-2.5 py-1 text-xs font-bold font-mono bg-white">${item.quantity}</span>
                        <button type="button" class="btn-cart-plus px-2.5 py-1 text-xs font-bold" data-id="${item.id}">+</button>
                      </div>
                      <button type="button" class="btn-cart-del text-[#8C8072] hover:text-rose-600 p-1" data-id="${item.id}">✕</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right: Cost & GST Breakdown -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Coupon box -->
          <div class="p-6 bg-white rounded-2xl border border-[#E8E1D5] shadow-xs space-y-4">
            <h3 class="text-sm font-bold font-display text-[#26201B]">Promo Code</h3>
            ${state.appliedCoupon ? `
              <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <strong class="font-mono text-emerald-900">${state.appliedCoupon.code}</strong>
                  <p class="text-[11px] text-emerald-700">${state.appliedCoupon.description}</p>
                </div>
                <button type="button" id="remove-coupon-btn" class="text-rose-600 font-semibold underline">Remove</button>
              </div>
            ` : `
              <div class="flex gap-2">
                <input type="text" id="cart-coupon-input" placeholder="e.g. STYLE20" class="flex-1 px-3 py-2 text-xs border border-[#DDD5C7] rounded-lg uppercase font-mono">
                <button type="button" id="apply-coupon-btn" class="px-4 py-2 bg-[#26201B] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#3B322B]">Apply</button>
              </div>
              <div class="text-[11px] text-[#736657]">
                Try code <strong class="text-[#26201B]">STYLE20</strong> (20% off > ₹3,000) or <strong class="text-[#26201B]">WELCOME10</strong> (10% off)
              </div>
            `}
          </div>

          <!-- Total Calculation Card -->
          <div class="p-6 bg-white rounded-2xl border border-[#E8E1D5] shadow-xs space-y-4">
            <h3 class="text-sm font-bold font-display text-[#26201B] pb-3 border-b border-[#E8E1D5]">GST Tax Breakdown</h3>
            <div class="space-y-2.5 text-xs text-[#5E5347]">
              <div class="flex justify-between">
                <span>Items Subtotal</span>
                <span class="font-mono font-semibold text-[#26201B]">₹${totals.subtotal.toLocaleString('en-IN')}</span>
              </div>
              ${totals.discountAmount > 0 ? `
                <div class="flex justify-between text-emerald-700">
                  <span>Coupon Savings (${state.appliedCoupon.code})</span>
                  <span class="font-mono">-₹${totals.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}
              <div class="flex justify-between pt-1 border-t border-[#E8E1D5] text-[#26201B] font-semibold">
                <span>Taxable Amount</span>
                <span class="font-mono">₹${totals.taxableSubtotal.toLocaleString('en-IN')}</span>
              </div>

              <!-- Itemized GST -->
              <div class="pl-3 py-1 border-l-2 border-[#DDD5C7] space-y-1 text-[11px] text-[#736657]">
                <div class="flex justify-between">
                  <span>Central GST (CGST @ 9%)</span>
                  <span class="font-mono">₹${totals.cgst.toLocaleString('en-IN')}</span>
                </div>
                <div class="flex justify-between">
                  <span>State GST (SGST @ 9%)</span>
                  <span class="font-mono">₹${totals.sgst.toLocaleString('en-IN')}</span>
                </div>
                <div class="flex justify-between font-bold text-[#26201B]">
                  <span>Total GST (18%)</span>
                  <span class="font-mono">₹${totals.totalGst.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div class="flex justify-between pt-1 border-t border-[#E8E1D5]">
                <span>Insured Express Shipping</span>
                <span class="font-mono font-semibold text-[#26201B]">${totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}</span>
              </div>

              <div class="flex justify-between items-baseline pt-4 border-t-2 border-[#26201B] text-[#26201B]">
                <div>
                  <span class="text-base font-bold font-display block">Total Payable</span>
                  <span class="text-[10px] text-[#8C8072]">All 18% GST included</span>
                </div>
                <span class="text-2xl font-bold font-mono">₹${totals.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button type="button" id="cart-checkout-btn" class="w-full mt-4 py-4 px-6 bg-[#26201B] hover:bg-[#3B322B] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md">
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindCartPageEvents() {
  document.getElementById('cart-explore-btn')?.addEventListener('click', () => navigateTo('shop'));
  document.getElementById('cart-clear-btn')?.addEventListener('click', () => {
    state.cart = [];
    persistState();
    showToast('Shopping bag cleared', '', 'info');
    renderView();
  });

  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => navigateTo('checkout'));

  document.querySelectorAll('.btn-cart-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = state.cart.find(x => x.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          state.cart = state.cart.filter(x => x.id !== id);
        }
        persistState();
        renderView();
      }
    });
  });

  document.querySelectorAll('.btn-cart-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = state.cart.find(x => x.id === id);
      if (item) {
        item.quantity++;
        persistState();
        renderView();
      }
    });
  });

  document.querySelectorAll('.btn-cart-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      state.cart = state.cart.filter(x => x.id !== id);
      persistState();
      showToast('Item removed', '', 'info');
      renderView();
    });
  });

  document.getElementById('apply-coupon-btn')?.addEventListener('click', () => {
    const input = document.getElementById('cart-coupon-input')?.value.trim().toUpperCase();
    const totals = calculateTotals();
    const found = VALID_COUPONS.find(c => c.code === input);

    if (!found) {
      showToast('Invalid Coupon', 'Try STYLE20, WELCOME10, or FLASHSALE.', 'error');
      return;
    }
    if (totals.subtotal < found.minOrder) {
      showToast('Order Minimum Unmet', `Minimum order of ₹${found.minOrder.toLocaleString('en-IN')} required for ${found.code}.`, 'error');
      return;
    }

    state.appliedCoupon = found;
    showToast(`Coupon Applied: ${found.code}`, found.description, 'success');
    renderView();
  });

  document.getElementById('remove-coupon-btn')?.addEventListener('click', () => {
    state.appliedCoupon = null;
    showToast('Coupon removed', '', 'info');
    renderView();
  });
}

// PAGE 6: CHECKOUT PAGE (Strict 6-digit PIN, 10-digit Phone, Email Validation)
function renderCheckoutPage() {
  if (state.cart.length === 0) {
    return `<div class="p-20 text-center"><h2 class="text-xl font-bold font-display">Bag is empty</h2><button id="checkout-ret-btn" class="mt-4 px-4 py-2 bg-[#26201B] text-white rounded-lg">Return to Shop</button></div>`;
  }

  const totals = calculateTotals();
  const user = state.currentUser;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="flex items-center justify-between pb-6 mb-8 border-b border-[#E8E1D5]">
        <div>
          <button type="button" id="checkout-back-to-cart-btn" class="text-xs font-semibold text-[#736657] hover:text-[#26201B] flex items-center gap-1 mb-1">
            ← Return to Bag
          </button>
          <h1 class="text-3xl font-bold font-display text-[#26201B]">Secure Checkout & Dispatch</h1>
        </div>
        <div class="text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
          🔒 256-Bit SSL Encrypted
        </div>
      </div>

      <form id="checkout-form" class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Inputs (7 Cols) -->
        <div class="lg:col-span-7 space-y-8">
          <div class="p-6 bg-white rounded-2xl border border-[#E8E1D5] shadow-xs space-y-4">
            <h2 class="text-base font-bold font-display text-[#26201B] pb-2 border-b border-[#E8E1D5]">
              1. Delivery Address & Contact (Strict Validation)
            </h2>

            <div>
              <label class="text-xs font-semibold text-[#26201B] block mb-1">Full Name *</label>
              <input type="text" id="chk-name" value="${user?.name || ''}" placeholder="e.g. Aarav Mehta" class="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg focus:bg-white focus:outline-none">
              <span id="err-name" class="text-[11px] text-rose-600 block mt-0.5"></span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Email (RFC valid) -->
              <div>
                <label class="text-xs font-semibold text-[#26201B] block mb-1">Email Address * <span class="text-[#8C8072] font-normal">(for GST invoice)</span></label>
                <input type="email" id="chk-email" value="${user?.email || ''}" placeholder="name@domain.com" class="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg focus:bg-white focus:outline-none">
                <span id="err-email" class="text-[11px] text-rose-600 block mt-0.5"></span>
              </div>

              <!-- 10-Digit Mobile Phone -->
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-semibold text-[#26201B]">10-Digit Mobile Phone *</label>
                  <span class="text-[10px] text-[#8C8072] font-mono">10 Digits</span>
                </div>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8C8072]">+91</span>
                  <input type="tel" id="chk-phone" maxlength="10" value="${user?.phone || ''}" placeholder="9876543210" class="w-full pl-12 pr-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg focus:bg-white focus:outline-none font-mono">
                </div>
                <span id="err-phone" class="text-[11px] text-rose-600 block mt-0.5"></span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- 6-Digit PIN Code -->
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-semibold text-[#26201B]">6-Digit PIN Code *</label>
                  <span class="text-[10px] text-[#8C8072] font-mono">6 Digits</span>
                </div>
                <input type="text" id="chk-pin" maxlength="6" value="${user?.pincode || '560001'}" placeholder="560001" class="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg focus:bg-white focus:outline-none font-mono">
                <span id="err-pin" class="text-[11px] text-rose-600 block mt-0.5"></span>
              </div>

              <div>
                <label class="text-xs font-semibold text-[#26201B] block mb-1">City *</label>
                <input type="text" id="chk-city" value="${user?.city || 'Bengaluru'}" class="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg">
                <span id="err-city" class="text-[11px] text-rose-600 block mt-0.5"></span>
              </div>

              <div>
                <label class="text-xs font-semibold text-[#26201B] block mb-1">State *</label>
                <input type="text" id="chk-state" value="${user?.state || 'Karnataka'}" class="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg">
                <span id="err-state" class="text-[11px] text-rose-600 block mt-0.5"></span>
              </div>
            </div>

            <div>
              <label class="text-xs font-semibold text-[#26201B] block mb-1">Complete Street Address *</label>
              <textarea id="chk-address" rows="2" placeholder="Flat No., Building name, Street" class="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg focus:bg-white">${user?.address || '14, 100 Feet Road, Indiranagar'}</textarea>
              <span id="err-address" class="text-[11px] text-rose-600 block mt-0.5"></span>
            </div>
          </div>

          <!-- Payment Options -->
          <div class="p-6 bg-white rounded-2xl border border-[#E8E1D5] shadow-xs space-y-4">
            <h2 class="text-base font-bold font-display text-[#26201B] pb-2 border-b border-[#E8E1D5]">
              2. Payment Authorization
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label class="p-3 border rounded-xl cursor-pointer bg-[#FAF7F2] border-[#26201B]">
                <input type="radio" name="pay-method" value="upi" checked class="accent-[#26201B]">
                <span class="block text-xs font-bold text-[#26201B] mt-1">Instant UPI</span>
                <span class="text-[10px] text-[#8C8072]">GPay, PhonePe</span>
              </label>
              <label class="p-3 border rounded-xl cursor-pointer border-[#DDD5C7]">
                <input type="radio" name="pay-method" value="card" class="accent-[#26201B]">
                <span class="block text-xs font-bold text-[#26201B] mt-1">Cards</span>
                <span class="text-[10px] text-[#8C8072]">RuPay, Visa, MC</span>
              </label>
              <label class="p-3 border rounded-xl cursor-pointer border-[#DDD5C7]">
                <input type="radio" name="pay-method" value="netbanking" class="accent-[#26201B]">
                <span class="block text-xs font-bold text-[#26201B] mt-1">Net Banking</span>
                <span class="text-[10px] text-[#8C8072]">HDFC, ICICI, SBI</span>
              </label>
              <label class="p-3 border rounded-xl cursor-pointer border-[#DDD5C7]">
                <input type="radio" name="pay-method" value="cod" class="accent-[#26201B]">
                <span class="block text-xs font-bold text-[#26201B] mt-1">Cash on Del.</span>
                <span class="text-[10px] text-[#8C8072]">Doorstep verification</span>
              </label>
            </div>
            <div id="upi-extra-box" class="p-4 bg-[#FAF7F2] rounded-xl border border-[#DDD5C7] space-y-2">
              <label class="text-xs font-semibold text-[#26201B] block">Virtual Payment Address (UPI ID) *</label>
              <input type="text" id="chk-upi-id" value="patron@okhdfcbank" class="w-full px-3 py-2 text-xs bg-white border border-[#DDD5C7] rounded-lg font-mono">
              <span id="err-upi" class="text-[11px] text-rose-600 block"></span>
            </div>
          </div>
        </div>

        <!-- Right Summary & Place Order -->
        <div class="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div class="p-6 bg-white rounded-2xl border border-[#E8E1D5] shadow-xs space-y-4">
            <h3 class="text-sm font-bold font-display text-[#26201B] pb-3 border-b border-[#E8E1D5]">Order Summary</h3>
            <div class="space-y-2.5 text-xs text-[#5E5347]">
              <div class="flex justify-between"><span>Items Subtotal</span><span class="font-mono font-semibold text-[#26201B]">₹${totals.subtotal.toLocaleString('en-IN')}</span></div>
              ${totals.discountAmount > 0 ? `<div class="flex justify-between text-emerald-700"><span>Coupon Discount</span><span class="font-mono">-₹${totals.discountAmount.toLocaleString('en-IN')}</span></div>` : ''}
              <div class="flex justify-between font-semibold text-[#26201B]"><span>Taxable Subtotal</span><span class="font-mono">₹${totals.taxableSubtotal.toLocaleString('en-IN')}</span></div>
              <div class="pl-3 py-1 border-l-2 border-[#DDD5C7] space-y-1 text-[11px]">
                <div class="flex justify-between"><span>Central GST (9%)</span><span class="font-mono">₹${totals.cgst.toLocaleString('en-IN')}</span></div>
                <div class="flex justify-between"><span>State GST (9%)</span><span class="font-mono">₹${totals.sgst.toLocaleString('en-IN')}</span></div>
                <div class="flex justify-between font-bold text-[#26201B]"><span>Total GST (18%)</span><span class="font-mono">₹${totals.totalGst.toLocaleString('en-IN')}</span></div>
              </div>
              <div class="flex justify-between"><span>Shipping</span><span class="font-mono font-semibold">${totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}</span></div>
              <div class="flex justify-between items-baseline pt-4 border-t-2 border-[#26201B] text-[#26201B]">
                <span class="text-base font-bold font-display">Grand Total</span>
                <span class="text-2xl font-bold font-mono">₹${totals.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button type="submit" id="btn-submit-order" class="w-full mt-4 py-4 px-6 bg-[#26201B] hover:bg-[#3B322B] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md">
              Authorize & Place Order (₹${totals.grandTotal.toLocaleString('en-IN')})
            </button>
          </div>
        </div>
      </form>
    </div>
  `;
}

function bindCheckoutPageEvents() {
  document.getElementById('checkout-ret-btn')?.addEventListener('click', () => navigateTo('shop'));
  document.getElementById('checkout-back-to-cart-btn')?.addEventListener('click', () => navigateTo('cart'));

  // Auto-fill city/state on 6-digit pin change
  document.getElementById('chk-pin')?.addEventListener('input', (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    e.target.value = val;
    if (val.length === 6 && PINCODE_DATABASE[val]) {
      document.getElementById('chk-city').value = PINCODE_DATABASE[val].city;
      document.getElementById('chk-state').value = PINCODE_DATABASE[val].state;
    }
  });

  document.getElementById('chk-phone')?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });

  // Form submission with strict validation
  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('chk-name').value.trim();
    const email = document.getElementById('chk-email').value.trim();
    const phone = document.getElementById('chk-phone').value.trim();
    const pin = document.getElementById('chk-pin').value.trim();
    const city = document.getElementById('chk-city').value.trim();
    const stateVal = document.getElementById('chk-state').value.trim();
    const address = document.getElementById('chk-address').value.trim();

    let valid = true;

    // Reset error labels
    document.querySelectorAll('[id^="err-"]').forEach(el => el.textContent = '');

    if (!name || name.length < 2) {
      document.getElementById('err-name').textContent = 'Please enter full recipient name (min 2 characters)';
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById('err-email').textContent = 'Please enter a valid email address (e.g. name@domain.com)';
      valid = false;
    }

    // 10-Digit Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      document.getElementById('err-phone').textContent = 'Must be exactly 10 digits starting with 6, 7, 8, or 9';
      valid = false;
    }

    // 6-Digit PIN code validation
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pin || !pinRegex.test(pin)) {
      document.getElementById('err-pin').textContent = 'Must be a valid 6-digit PIN code (e.g. 560001, 110001)';
      valid = false;
    }

    if (!city) {
      document.getElementById('err-city').textContent = 'City is required';
      valid = false;
    }
    if (!stateVal) {
      document.getElementById('err-state').textContent = 'State is required';
      valid = false;
    }
    if (!address || address.length < 5) {
      document.getElementById('err-address').textContent = 'Please provide complete street address';
      valid = false;
    }

    if (!valid) {
      showToast('Validation Error', 'Please correct the highlighted fields.', 'error');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    const totals = calculateTotals();
    const orderNum = Math.floor(100000 + Math.random() * 900000);
    const delDate = new Date();
    delDate.setDate(delDate.getDate() + 3);

    const newOrder = {
      id: `ORD-${orderNum}`,
      date: new Date().toISOString(),
      items: [...state.cart],
      shippingAddress: { fullName: name, email, phone, pincode: pin, city, state: stateVal, address },
      subtotal: totals.subtotal,
      discount: totals.discountAmount,
      couponCode: state.appliedCoupon?.code,
      taxableSubtotal: totals.taxableSubtotal,
      cgst: totals.cgst,
      sgst: totals.sgst,
      totalGst: totals.totalGst,
      shipping: totals.shipping,
      grandTotal: totals.grandTotal,
      estimatedDeliveryDate: delDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
      trackingNumber: `ATLR-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      invoiceNumber: `INV-2026-${orderNum}`
    };

    state.lastOrder = newOrder;
    state.orders.unshift(newOrder);
    state.cart = [];
    state.appliedCoupon = null;
    persistState();

    showToast('Order Confirmed!', `Invoice #${newOrder.invoiceNumber} logged`, 'success');
    navigateTo('order-confirmed');
  });
}

// PAGE 7: ORDER CONFIRMATION & PRINTABLE TAX INVOICE
function renderOrderConfirmedPage() {
  const o = state.lastOrder;
  if (!o) {
    return `<div class="p-20 text-center"><h2 class="text-xl font-bold font-display">No recent order</h2><button id="conf-ret-btn" class="mt-4 px-4 py-2 bg-[#26201B] text-white rounded-lg">Return to Catalog</button></div>`;
  }

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div class="text-center space-y-3 mb-10">
        <span class="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          Payment & Dispatch Confirmed
        </span>
        <h1 class="text-3xl sm:text-4xl font-bold font-display text-[#26201B]">
          Thank you for your order, ${o.shippingAddress.fullName}.
        </h1>
        <p class="text-xs sm:text-sm text-[#736657] max-w-lg mx-auto">
          Order reference <strong class="font-mono text-[#26201B]">${o.id}</strong> has been confirmed. Tax invoice sent to <span class="text-[#26201B] font-medium">${o.shippingAddress.email}</span>.
        </p>
        <div class="flex items-center justify-center gap-3 pt-4">
          <button type="button" id="btn-print-tax-invoice" class="px-5 py-2.5 bg-[#26201B] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#3B322B] shadow-xs">
            🖨️ Print Official GST Tax Invoice
          </button>
          <button type="button" id="btn-order-continue-shop" class="px-5 py-2.5 border border-[#DDD5C7] text-[#26201B] text-xs font-semibold rounded-xl hover:bg-[#EFEAE1]">
            Continue Shopping →
          </button>
        </div>
      </div>

      <!-- Printable GST Tax Invoice Container -->
      <div id="printable-tax-invoice" class="p-8 bg-white rounded-2xl border border-[#DDD5C7] shadow-sm space-y-6 text-xs text-[#26201B]">
        <div class="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-[#26201B]">
          <div>
            <h2 class="text-2xl font-bold font-display tracking-tight text-[#26201B]">ATELIER NORD</h2>
            <p class="text-xs text-[#736657]">Contemporary Clothing & Fine Textile Studio</p>
            <div class="text-[11px] text-[#736657] mt-2 space-y-0.5">
              <p>Atelier Studio Pvt Ltd, 14 Indiranagar 100ft Rd, Bengaluru 560038</p>
              <p><strong>GSTIN / Tax ID:</strong> 07AAACG9921D1Z8</p>
            </div>
          </div>
          <div class="sm:text-right space-y-1">
            <span class="inline-block px-2.5 py-1 bg-[#26201B] text-[#FAF7F2] text-[11px] font-bold uppercase rounded">
              Original Tax Invoice
            </span>
            <p class="text-xs text-[#736657] pt-2 font-mono">Invoice #: <strong>${o.invoiceNumber}</strong></p>
            <p class="text-xs text-[#736657] font-mono">Date: <strong>${new Date(o.date).toLocaleDateString('en-IN')}</strong></p>
            <p class="text-xs text-[#736657] font-mono">Order Ref: <strong>${o.id}</strong></p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5]">
          <div>
            <span class="text-[11px] font-bold uppercase text-[#736657] block mb-1">Billed To & Shipping Destination</span>
            <p class="font-bold text-[#26201B] text-sm">${o.shippingAddress.fullName}</p>
            <p class="text-[#5E5347] mt-1">${o.shippingAddress.address}</p>
            <p class="text-[#5E5347]">${o.shippingAddress.city}, ${o.shippingAddress.state} — <strong>${o.shippingAddress.pincode}</strong></p>
            <p class="text-[#736657] text-[11px]">Phone: +91 ${o.shippingAddress.phone}</p>
          </div>
          <div>
            <span class="text-[11px] font-bold uppercase text-[#736657] block mb-1">Courier Logistics</span>
            <p><strong>Air Waybill ID:</strong> <span class="font-mono">${o.trackingNumber}</span></p>
            <p><strong>Estimated Delivery:</strong> ${o.estimatedDeliveryDate}</p>
            <p class="text-emerald-800 font-semibold mt-2">✓ Input Tax Credit (ITC) Eligible</p>
          </div>
        </div>

        <div class="overflow-x-auto border border-[#E8E1D5] rounded-xl">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#FAF7F2] text-[#26201B] font-bold border-b border-[#E8E1D5]">
              <tr>
                <th class="py-3 px-4">Item & Variant</th>
                <th class="py-3 px-4">HSN</th>
                <th class="py-3 px-4 text-center">Qty</th>
                <th class="py-3 px-4 text-right">Taxable Unit (₹)</th>
                <th class="py-3 px-4 text-right">GST Rate</th>
                <th class="py-3 px-4 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8E1D5] tabular-nums">
              ${o.items.map(it => {
                const p = PRODUCTS.find(x => x.id === it.productId) || PRODUCTS[0];
                return `
                  <tr>
                    <td class="py-3 px-4 font-bold">${p.name} <span class="block text-[11px] text-[#736657] font-normal">Size: ${it.selectedSize} · Color: ${it.selectedColor.name}</span></td>
                    <td class="py-3 px-4 font-mono text-[#736657]">${p.hsnCode}</td>
                    <td class="py-3 px-4 text-center font-bold font-mono">${it.quantity}</td>
                    <td class="py-3 px-4 text-right font-mono">₹${it.unitPrice.toLocaleString('en-IN')}</td>
                    <td class="py-3 px-4 text-right font-mono text-[#736657]">18%</td>
                    <td class="py-3 px-4 text-right font-mono font-bold">₹${(it.unitPrice * it.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-[#E8E1D5]">
          <div class="text-[11px] text-[#736657]">
            <p><strong>Declaration:</strong> Certified that particulars given above are true and correct.</p>
          </div>
          <div class="w-full sm:w-72 space-y-1.5 text-xs">
            <div class="flex justify-between"><span>Subtotal:</span><span class="font-mono">₹${o.subtotal.toLocaleString('en-IN')}</span></div>
            ${o.discount > 0 ? `<div class="flex justify-between text-emerald-700"><span>Discount (${o.couponCode}):</span><span class="font-mono">-₹${o.discount.toLocaleString('en-IN')}</span></div>` : ''}
            <div class="flex justify-between"><span>Taxable Value:</span><span class="font-mono font-semibold">₹${o.taxableSubtotal.toLocaleString('en-IN')}</span></div>
            <div class="flex justify-between"><span>CGST (9%):</span><span class="font-mono">₹${o.cgst.toLocaleString('en-IN')}</span></div>
            <div class="flex justify-between"><span>SGST (9%):</span><span class="font-mono">₹${o.sgst.toLocaleString('en-IN')}</span></div>
            <div class="flex justify-between font-bold text-[#26201B]"><span>Total GST (18%):</span><span class="font-mono">₹${o.totalGst.toLocaleString('en-IN')}</span></div>
            <div class="flex justify-between"><span>Insured Shipping:</span><span class="font-mono font-semibold">${o.shipping === 0 ? 'FREE' : `₹${o.shipping}`}</span></div>
            <div class="flex justify-between text-base font-bold text-[#26201B] pt-2 border-t-2 border-[#26201B]">
              <span>Grand Total:</span>
              <span class="font-mono">₹${o.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindOrderConfirmedPageEvents() {
  document.getElementById('conf-ret-btn')?.addEventListener('click', () => navigateTo('shop'));
  document.getElementById('btn-order-continue-shop')?.addEventListener('click', () => navigateTo('shop'));
  document.getElementById('btn-print-tax-invoice')?.addEventListener('click', () => {
    window.print();
  });
}

// PAGE 8: AUTH PAGE (Login / Register / 1-Click Demo Profiles / Past Orders)
function renderAuthPage() {
  const user = state.currentUser;

  if (user) {
    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        <div class="p-6 sm:p-8 bg-white rounded-2xl border border-[#E8E1D5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-[#26201B] text-[#FAF7F2] flex items-center justify-center font-bold text-xl font-display">
              ${user.name.charAt(0)}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl font-bold font-display text-[#26201B]">${user.name}</h1>
                <span class="text-[10px] font-bold uppercase bg-[#EFEAE1] text-[#26201B] px-2 py-0.5 rounded">${user.tier || 'Standard Patron'}</span>
              </div>
              <p class="text-xs text-[#736657] mt-0.5">${user.email} · +91 ${user.phone}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button type="button" id="auth-shop-btn" class="px-4 py-2 bg-[#26201B] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#3B322B]">Browse Drops</button>
            <button type="button" id="auth-logout-btn" class="px-4 py-2 border border-[#DDD5C7] text-[#26201B] text-xs font-semibold rounded-lg hover:bg-[#EFEAE1]">Sign Out</button>
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-base font-bold font-display text-[#26201B]">Order History & Invoices (${state.orders.length})</h2>
          ${state.orders.length === 0 ? `
            <div class="p-8 bg-white rounded-2xl border border-[#E8E1D5] text-center text-xs text-[#736657]">
              No past orders logged in this active session.
            </div>
          ` : `
            <div class="space-y-4">
              ${state.orders.map(o => `
                <div class="p-6 bg-white rounded-2xl border border-[#E8E1D5] shadow-xs space-y-2 text-xs">
                  <div class="flex justify-between font-bold">
                    <span class="font-mono">${o.id} · Invoice: ${o.invoiceNumber}</span>
                    <span class="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
                  </div>
                  <p class="text-[#736657]">Estimated Delivery: ${o.estimatedDeliveryDate}</p>
                  <p class="font-mono font-bold text-sm text-[#26201B]">Total with 18% GST: ₹${o.grandTotal.toLocaleString('en-IN')}</p>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  // Not logged in: Show Login / Demo Logins
  return `
    <div class="max-w-md mx-auto px-4 py-16">
      <div class="bg-white p-8 rounded-2xl border border-[#E8E1D5] shadow-xs space-y-6">
        <div class="text-center">
          <span class="text-xs font-bold uppercase text-[#736657]">Atelier Nord Client Access</span>
          <h1 class="text-2xl font-bold font-display text-[#26201B] mt-1">Patron Sign In</h1>
        </div>

        <!-- 1-Click Demo Profiles -->
        <div class="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] space-y-2.5">
          <span class="text-[11px] font-bold uppercase tracking-wider text-[#736657] block">Instant 1-Click Demo Profiles</span>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" id="demo-shopper-btn" class="p-2.5 text-xs text-left bg-white border border-[#DDD5C7] rounded-lg hover:border-[#26201B]">
              <strong class="block text-[#26201B]">Demo Shopper</strong>
              <span class="text-[10px] text-[#736657]">Aarav Mehta</span>
            </button>
            <button type="button" id="demo-vip-btn" class="p-2.5 text-xs text-left bg-white border border-[#DDD5C7] rounded-lg hover:border-[#26201B]">
              <strong class="block text-[#26201B]">VIP Member</strong>
              <span class="text-[10px] text-[#736657]">Priya Sharma</span>
            </button>
          </div>
        </div>

        <form id="login-form" class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-[#26201B] block mb-1">Email Address</label>
            <input type="email" id="login-email" required value="patron@example.com" class="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg focus:bg-white focus:outline-none">
          </div>
          <div>
            <label class="text-xs font-semibold text-[#26201B] block mb-1">Password</label>
            <input type="password" id="login-pass" required value="••••••••" class="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg focus:bg-white focus:outline-none font-mono">
          </div>
          <button type="submit" class="w-full py-3 bg-[#26201B] hover:bg-[#3B322B] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm">
            Sign In
          </button>
        </form>
      </div>
    </div>
  `;
}

function bindAuthPageEvents() {
  document.getElementById('auth-shop-btn')?.addEventListener('click', () => navigateTo('shop'));
  document.getElementById('auth-logout-btn')?.addEventListener('click', () => {
    state.currentUser = null;
    showToast('Logged out', '', 'info');
    renderView();
  });

  document.getElementById('demo-shopper-btn')?.addEventListener('click', () => {
    state.currentUser = DEMO_PROFILES.shopper;
    showToast(`Logged in as ${DEMO_PROFILES.shopper.name}`, '', 'success');
    renderView();
  });

  document.getElementById('demo-vip-btn')?.addEventListener('click', () => {
    state.currentUser = DEMO_PROFILES.vip;
    showToast(`Logged in as ${DEMO_PROFILES.vip.name} (VIP)`, '', 'success');
    renderView();
  });

  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    state.currentUser = {
      name: email.split('@')[0],
      email,
      phone: '9876543210',
      tier: 'Standard Patron',
      pincode: '560001',
      city: 'Bengaluru',
      state: 'Karnataka',
      address: 'Indiranagar 100ft Rd'
    };
    showToast(`Welcome back, ${state.currentUser.name}!`, '', 'success');
    renderView();
  });
}

// Global Nav and Modal Listeners
function setupGlobalListeners() {
  // Navigation clicks
  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('.nav-link-action');
    if (navBtn) {
      e.preventDefault();
      const page = navBtn.getAttribute('data-nav');
      const cat = navBtn.getAttribute('data-category');
      
      // Close mobile drawer if open
      document.getElementById('mobile-drawer')?.classList.add('hidden');

      if (page) {
        navigateTo(page, { category: cat });
      }
    }
  });

  // Mobile drawer controls
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');

  mobileMenuBtn?.addEventListener('click', () => mobileDrawer?.classList.remove('hidden'));
  mobileDrawerClose?.addEventListener('click', () => mobileDrawer?.classList.add('hidden'));
  mobileDrawerBackdrop?.addEventListener('click', () => mobileDrawer?.classList.add('hidden'));

  // Search toggle
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchWrapper = document.getElementById('search-input-wrapper');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('search-input');

  searchToggleBtn?.addEventListener('click', () => {
    searchWrapper?.classList.remove('hidden');
    searchInput?.focus();
  });
  searchCloseBtn?.addEventListener('click', () => {
    searchWrapper?.classList.add('hidden');
  });
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      state.searchQuery = searchInput.value;
      searchWrapper?.classList.add('hidden');
      navigateTo('shop');
    }
  });

  // Size guide modal controls
  const modalSizeGuide = document.getElementById('modal-size-guide');
  const closeSizeGuideBtn = document.getElementById('close-size-guide-btn');
  const closeSizeGuideFooterBtn = document.getElementById('close-size-guide-footer-btn');
  const openSizeGuideFooter = document.getElementById('open-size-guide-footer');

  closeSizeGuideBtn?.addEventListener('click', () => modalSizeGuide?.classList.add('hidden'));
  closeSizeGuideFooterBtn?.addEventListener('click', () => modalSizeGuide?.classList.add('hidden'));
  openSizeGuideFooter?.addEventListener('click', () => modalSizeGuide?.classList.remove('hidden'));

  // Newsletter submission
  document.getElementById('newsletter-submit-btn')?.addEventListener('click', () => {
    const input = document.getElementById('newsletter-email-input');
    const val = input?.value.trim();
    if (val && val.includes('@')) {
      showToast('Welcome to Atelier Nord!', 'Use voucher WELCOME10 for 10% off', 'success');
      document.getElementById('newsletter-box').innerHTML = `
        <div class="p-3 bg-[#332A24] rounded-lg text-xs text-emerald-400">
          ✓ Voucher active: <strong class="text-white font-mono">WELCOME10</strong>
        </div>
      `;
    } else {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
    }
  });
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  setupGlobalListeners();
  renderView();
});

// Direct execution in case DOM is already parsed
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setupGlobalListeners();
  renderView();
}
