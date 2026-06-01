<template>
  <div class="bg-gray-50/50 dark:bg-[#0b1120] min-h-screen pb-20 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased">

    <ProductFilter :_p="_p" :_$p="_$p" :_$cb="filterCb" :config="{ theme: isDark ? 'dark' : 'light' }" />

    <div class="max-w-[1440px] mx-auto w-full px-3 md:px-6 py-4 md:py-6">

      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        <div v-for="n in 12" :key="n" class="bg-white dark:bg-[#1e293b] rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col gap-3">
          <div class="aspect-[4/5] bg-gray-200 dark:bg-slate-700/50 rounded-xl relative overflow-hidden">
            <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div class="space-y-2 mt-1 px-1">
            <div class="h-5 bg-gray-200 dark:bg-slate-700/50 rounded-md w-1/2 relative overflow-hidden"><div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div></div>
            <div class="h-3 bg-gray-200 dark:bg-slate-700/50 rounded-md w-1/3 relative overflow-hidden"><div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div></div>
            <div class="h-10 bg-gray-200 dark:bg-slate-700/50 rounded-xl w-full mt-3 relative overflow-hidden"><div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div></div>
          </div>
        </div>
      </div>

      <ul v-else-if="products.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 list-none">
        <li
          v-for="(item, index) in products"
          :key="(item.document?.id || '') + index"
          class="card-enter group relative flex flex-col cursor-pointer rounded-2xl bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-700/40 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-300 ease-out overflow-hidden"
          :style="{ animationDelay: `${(index % 10) * 50}ms` }"
          @click="goToProduct(item)"
        >
          <!-- Image area -->
          <div class="relative overflow-hidden bg-gray-50 dark:bg-slate-800/60"
            @mouseenter="startHoverCycle(item)"
            @mouseleave="stopHoverCycle(item)"
            @touchstart="handleTouchStart($event, item)"
            @touchend="handleTouchEnd($event, item)"
          >
            <div class="aspect-[4/5] relative">
              <template v-if="item.images && item.images.length > 0">
                <img
                  v-for="(img, idx) in item.images"
                  :key="idx"
                  :src="img"
                  loading="lazy"
                  :alt="item.document?.title || item.document?.brand"
                  @error="handleImageError"
                  class="absolute inset-0 w-full h-full object-cover transition-all duration-700 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105"
                  :class="idx === item.activeIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'"
                />
              </template>
              <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-400 text-xs">No Image</div>
            </div>

            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

            <!-- Image dots -->
            <div v-if="item.images && item.images.length > 1"
              class="absolute bottom-10 left-0 w-full flex justify-center gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div v-for="(_, idx) in item.images" :key="'nav-'+idx"
                @mouseenter.stop="setActiveImage(item, idx)"
                class="w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300"
                :class="idx === item.activeIdx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/90'"></div>
            </div>

            <!-- Discount badge -->
            <span v-if="getDiscount(item.document) > 0"
              class="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full font-bold z-20 shadow-sm animate-pulse-once">
              -{{ getDiscount(item.document) }}%
            </span>

            <!-- Wishlist button -->
            <button
              class="wishlist-btn absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-md z-20 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200"
              @click.stop="toggleWishlist">
              <svg class="w-4 h-4 wishlist-icon text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <!-- Card body -->
          <div class="p-3 md:p-3.5 flex flex-col flex-1 gap-1">
            <!-- Brand -->
            <p class="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">{{ item.document?.brand || '\u00A0' }}</p>

            <!-- Title -->
            <h3 class="text-[12px] md:text-[13px] leading-snug text-slate-700 dark:text-slate-300 font-medium line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {{ item.document?.title || item.document?.brand || 'Premium Product' }}
            </h3>

            <div class="flex-1"></div>

            <!-- Rating -->
            <div class="flex items-center gap-1 mt-1">
              <div class="flex">
                <span v-for="s in 5" :key="s" class="text-amber-400 text-[10px]">★</span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500">(128)</span>
            </div>

            <!-- Price row -->
            <div class="flex items-center gap-2 mt-1">
              <span class="text-base md:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                {{ formatPrice(item.document?.variant_prices?.[0] || 0) }} ₽
              </span>
              <span v-if="(item.document?.variant_mrp?.[0] || 0) > (item.document?.variant_prices?.[0] || 0)"
                class="text-[11px] text-slate-400 line-through">
                {{ formatPrice(item.document?.variant_mrp?.[0] || 0) }}
              </span>
              <span class="ml-auto bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <span class="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span> Card
              </span>
            </div>

            <!-- Add to cart button -->
            <button
              class="mt-2.5 w-full py-2 md:py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-xs md:text-sm font-semibold active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 group/btn overflow-hidden relative"
              @click.stop="addToCart(item)">
              <span class="relative z-10 flex items-center gap-2">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                Add to Cart
              </span>
              <span class="absolute inset-0 bg-blue-600 dark:bg-blue-500 translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-300 ease-out"></span>
            </button>
          </div>
        </li>
      </ul>

      <div v-else class="flex flex-col items-center justify-center py-24 px-4 bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-100 dark:border-slate-800/60 shadow-sm mt-4">
        <div class="w-20 h-20 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-5">🔍</div>
        <h3 class="text-xl font-extrabold text-slate-900 dark:text-white mb-2">No results found</h3>
        <p class="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md text-sm">Try adjusting the filters or use broader keywords.</p>
        <button class="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all" @click="clearAllAndSearch">
          Clear All Filters
        </button>
      </div>

      <div ref="sentinel" class="h-24 flex justify-center items-center w-full mt-4">
        <div v-if="loadingMore" class="flex gap-2 p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700">
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        </div>
      </div>
    </div>

    <ContentEngine ref="cartPopupRef" v-bind="{ ce_file: _var.cart_popup.ce_file }" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ContentEngine from './Contentengin.vue';
import ProductFilter from '../src/components/Productfilter.vue';
import type { _$p_TYP, _p_TYP, _$cb_TYP } from '../../shared/types';
import { createTemplate } from "bind-str";

const { _p, __p:_$p } = defineProps<{ _p: _p_TYP, __p: _$p_TYP }>();

const router = useRouter();
const searchQuery = ref('');
const products = ref<any[]>([]);
const activeFilterByString = ref<string>('');
const isDark = ref(false);
const loading = ref(true);
const loadingMore = ref(false);
const page = ref(1);
const hasMore = ref(true);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const _t_temp = createTemplate(_$p.data.curr.data.api[`token`], {open:"<",close:">"});
const _token = _t_temp({ localStorage: { token: localStorage.getItem(`token`) || `` } }).replace(`Bearer `, ``);
const API_URL = _$p.data.curr.data.api[`url`];
const TOKEN = _token;
const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500';
const cartPopupRef: any = ref(null);
const _var = ref({ cart_popup: { ce_file: _$p.data.curr.data.cart_popup[`ce_file`] } });

const filterCb: _$cb_TYP = {
  change: (eventData: any) => {
    if (eventData && eventData.filter_by !== undefined) activeFilterByString.value = eventData.filter_by;
    page.value = 1; products.value = []; hasMore.value = true; loading.value = true;
    fetchProducts();
  }
};

const initTheme = () => {
  const saved = localStorage.getItem('theme');
  isDark.value = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', isDark.value);
};

const handleSearch = async () => {
  loading.value = true; products.value = []; page.value = 1; hasMore.value = true;
  const urlParams = new URLSearchParams(window.location.search);
  if (searchQuery.value) urlParams.set('q', searchQuery.value); else urlParams.delete('q');
  window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
  await fetchProducts();
  loading.value = false;
};

const clearAllAndSearch = () => {
  searchQuery.value = '';
  window.history.replaceState({}, '', window.location.pathname);
  handleSearch();
};

const fetchProducts = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (!searchQuery.value && urlParams.has('q')) searchQuery.value = urlParams.get('q') || '';
    let q = searchQuery.value.trim() || '_';
    let filterQueryStr = `?f_raw_text=${encodeURIComponent(q)}`;
    const specialParams = ['sattr_k', 'sattr_v', 'page', 'per_page', 'sort'];
    urlParams.forEach((value, key) => {
      if (key === 'q') return;
      if (specialParams.includes(key)) filterQueryStr += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      else value.split(',').forEach(val => { filterQueryStr += `&filter=${encodeURIComponent(key)}:${encodeURIComponent(val)}`; });
    });
    const baseUrl = API_URL.split('?')[0];
    const filterRes = await axios.post(`${baseUrl}?typ=get_filter_data`, { query: filterQueryStr }, { headers: { 'Authorization': `Bearer ${TOKEN}` } });
    if (!filterRes.data.success || !filterRes.data.search_combination) { hasMore.value = false; loading.value = false; return; }
    const searchCombination = filterRes.data.search_combination;
    searchCombination.page = page.value;
    searchCombination.per_page = 20;
    if (activeFilterByString.value) searchCombination.filter_by = activeFilterByString.value;
    else delete searchCombination.filter_by;
    const prodRes = await axios.post(`${baseUrl}?typ=get_product_list`, searchCombination, { headers: { 'Authorization': `Bearer ${TOKEN}` } });
    if (prodRes.data.success && prodRes.data.data?.products?.length > 0) {
      await new Promise(r => setTimeout(r, 300));
      for (const curr of prodRes.data.data.products) {
        products.value.push({ document: curr, images: getImages(curr), activeIdx: 0, interval: null });
      }
      loading.value = false;
    } else { hasMore.value = false; loading.value = false; }
  } catch (e) { console.error('Fetch Products Error:', e); hasMore.value = false; loading.value = false; }
};

const setupObserver = () => {
  observer = new IntersectionObserver(async (entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore.value && !loading.value && !loadingMore.value) {
      loadingMore.value = true; page.value++; await fetchProducts(); loadingMore.value = false;
    }
  }, { rootMargin: '200px' });
  if (sentinel.value) observer.observe(sentinel.value);
};

const getImages = (doc: any) => {
  try {
    const meta = typeof doc.metadata === 'string' ? JSON.parse(doc.metadata) : doc.metadata;
    const images = meta?.color?.[0]?.image;
    if (Array.isArray(images) && images.length > 0) {
      const urls = images.map((img: any) => img.url).filter((url: string) => url && !url.includes('example')).slice(0, 5);
      if (urls.length > 0) return urls;
    }
  } catch (e) {}
  const title = doc.title?.toLowerCase() || '';
  if (title.includes('dress')) return ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'];
  if (title.includes('shirt') || title.includes('top')) return ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'];
  if (title.includes('shoe') || title.includes('sneaker')) return ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'];
  if (title.includes('bag')) return ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500'];
  return [FALLBACK_IMAGE_URL];
};

const startHoverCycle = (item: any) => {
  if (!item.images || item.images.length <= 1) return;
  if (item.interval) clearInterval(item.interval);
  item.interval = setInterval(() => { item.activeIdx = (item.activeIdx + 1) % item.images.length; }, 1200);
};
const stopHoverCycle = (item: any) => { if (item.interval) { clearInterval(item.interval); item.interval = null; } item.activeIdx = 0; };
const setActiveImage = (item: any, index: number) => { item.activeIdx = index; if (item.interval) { clearInterval(item.interval); item.interval = null; } };

const touchStartX = ref(0);
const touchEndX = ref(0);
const handleTouchStart = (e: TouchEvent, item: any) => { touchStartX.value = e.changedTouches[0].screenX; if (item.interval) { clearInterval(item.interval); item.interval = null; } };
const handleTouchEnd = (e: TouchEvent, item: any) => { touchEndX.value = e.changedTouches[0].screenX; handleSwipe(item); };
const handleSwipe = (item: any) => {
  if (!item.images || item.images.length <= 1) return;
  const diff = touchEndX.value - touchStartX.value;
  if (diff > 40) item.activeIdx = item.activeIdx > 0 ? item.activeIdx - 1 : item.images.length - 1;
  else if (diff < -40) item.activeIdx = item.activeIdx < item.images.length - 1 ? item.activeIdx + 1 : 0;
};
const handleImageError = (event: Event) => { const img = event.target as HTMLImageElement; if (img.src !== FALLBACK_IMAGE_URL) img.src = FALLBACK_IMAGE_URL; };
const getDiscount = (doc: any) => { const p = doc?.variant_prices?.[0] || 0; const m = doc?.variant_mrp?.[0] || 0; return m > p ? Math.round(((m - p) / m) * 100) : 0; };
const formatPrice = (price: number) => { if (!price) return '0'; return new Intl.NumberFormat('ru-RU').format(price); };
const goToProduct = (v: any) => {
  if (!v.document?.slug && !v.document?.id) return;
  const _t = createTemplate(_$p.data.curr.data.event[`onProductClick`]);
  location.href = _t({ id: v.document?.id, slug: v.document?.slug });
};
const addToCart = (_v: any) => {
  if (!cartPopupRef.value) return;
  cartPopupRef.value.ce_call("msg", { type: "product:open", custom: { product_id: _v.document?.slug || _v.document?.id }, _p: {}, _$p: {} });
};
const toggleWishlist = (e: Event) => {
  const btn = e.currentTarget as HTMLElement;
  const icon = btn.querySelector('.wishlist-icon') as SVGElement;
  const isWished = btn.classList.toggle('wished');
  if (icon) {
    icon.style.stroke = isWished ? '#ef4444' : '';
    icon.style.fill = isWished ? '#ef4444' : 'none';
    icon.classList.toggle('scale-125', isWished);
  }
  btn.classList.toggle('bg-red-50', isWished);
  btn.classList.toggle('dark:bg-red-500/20', isWished);
};

onMounted(() => {
  initTheme();
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('q')) searchQuery.value = urlParams.get('q') || '';
  handleSearch().then(() => setTimeout(() => setupObserver(), 100));
});
onUnmounted(() => { if (observer) observer.disconnect(); });
</script>

<style>
@keyframes shimmer { 100% { transform: translateX(100%); } }

/* Card entrance animation */
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}
.card-enter {
  animation: cardEnter 0.4s ease-out both;
}

/* Discount badge one-time pulse */
@keyframes pulseOnce {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.animate-pulse-once { animation: pulseOnce 0.6s ease-out 0.3s both; }

/* Wishlist icon transition */
.wishlist-icon { transition: fill 0.2s ease, stroke 0.2s ease, transform 0.2s ease; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
.dark ::-webkit-scrollbar-thumb { background: #334155; }
.dark ::-webkit-scrollbar-thumb:hover { background: #475569; }
</style>
