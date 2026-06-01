<template>
  <div class="bg-gray-50/50 dark:bg-[#0b1120] min-h-screen font-sans text-slate-900 dark:text-slate-100 antialiased">

    <!-- Myntra-style layout: sidebar + content -->
    <div style="display:flex;align-items:flex-start;width:100%;">

      <!-- LEFT SIDEBAR FILTER -->
      <aside id="desktop-sidebar" class="desktop-sidebar-hide" :style="{ width:'240px', minWidth:'240px', borderRight:'1px solid ' + (isDark ? '#334155' : '#e5e7eb'), position:'sticky', top:'0', height:'100vh', overflowY:'auto', scrollbarWidth:'thin', scrollbarColor:'#e9e9eb transparent' }">
        <ProductFilter :_p="_p" :_$p="_$p" :_$cb="filterCb" :config="{ theme: isDark ? 'dark' : 'light', layout: 'sidebar' }" style="height:100%;" />
      </aside>

      <!-- RIGHT CONTENT -->
      <div style="flex:1;min-width:0;padding:20px 20px 80px;background:transparent;">

      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <div v-for="n in 12" :key="n" class="bg-white dark:bg-[#1e293b] rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col gap-3">
          <div class="aspect-[4/5] bg-gray-200 dark:bg-slate-700/50 rounded-xl relative overflow-hidden">
            <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div class="space-y-2 mt-1 px-1">
            <div class="h-5 bg-gray-200 dark:bg-slate-700/50 rounded-md w-1/2 relative overflow-hidden"><div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div></div>
            <div class="h-3 bg-gray-200 dark:bg-slate-700/50 rounded-md w-1/3 relative overflow-hidden"><div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div></div>
            <div class="h-4 bg-gray-200 dark:bg-slate-700/50 rounded-md w-full relative overflow-hidden mt-2"><div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div></div>
            <div class="h-10 bg-gray-200 dark:bg-slate-700/50 rounded-xl w-full mt-3 relative overflow-hidden"><div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div></div>
          </div>
        </div>
      </div>

      <ul v-else-if="products.length > 0" class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 list-none">
          <li 
            v-for="(item, index) in products" 
            :key="(item.document?.id || '') + index" 
            class="group bg-white dark:bg-[#1e293b] rounded-2xl flex flex-col relative cursor-pointer border border-gray-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            @click="goToProduct(item)"
          >
            
            <div>
              <div 
                class="aspect-[4/5] relative bg-gray-100 dark:bg-slate-800/80 overflow-hidden group/image"
                @mouseenter="startHoverCycle(item)"
                @mouseleave="stopHoverCycle(item)"
                @touchstart="handleTouchStart($event, item)"
                @touchend="handleTouchEnd($event, item)"
              >
                <template v-if="item.images && item.images.length > 0">
                  <img 
                    v-for="(img, idx) in item.images" 
                    :key="idx"
                    :src="img" 
                    loading="lazy" 
                    :alt="item.document?.title || item.document?.brand"
                    @error="handleImageError"
                    class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 mix-blend-multiply dark:mix-blend-normal" 
                    :class="idx === item.activeIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'"
                  />
                </template>

                <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-400 text-xs font-medium">
                  No Image
                </div>

                <div 
                  v-if="item.images && item.images.length > 1"
                  class="absolute bottom-3 left-0 w-full flex justify-center gap-1.5 z-20 opacity-100 md:opacity-0 md:group-hover/image:opacity-100 transition-opacity duration-300"
                >
                  <div 
                    v-for="(_, idx) in item.images" 
                    :key="'nav-'+idx"
                    @mouseenter.stop="setActiveImage(item, idx)"
                    class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full cursor-pointer transition-all duration-300"
                    :class="idx === item.activeIdx ? 'bg-white scale-125 shadow-[0_0_2px_rgba(0,0,0,0.5)]' : 'bg-white/50 hover:bg-white/90'"
                  ></div>
                </div>
                
                <span v-if="item._fromForm" class="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] md:text-xs px-2 py-1 rounded-md font-bold shadow-sm tracking-wide z-20">
                  ✦ My Product
                </span>
                <span v-else-if="getDiscount(item.document) > 0" class="absolute top-2 left-2 bg-red-500/90 backdrop-blur-md text-white text-[10px] md:text-xs px-2 py-1 rounded-md font-bold shadow-sm tracking-wide z-20">
                  -{{ getDiscount(item.document) }}%
                </span>

                <button 
                  class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-1 md:group-hover:translate-y-0 shadow-sm z-20"
                  @click.stop="toggleWishlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
            </div>

            <div class="p-3.5 md:p-4 flex flex-col flex-1 gap-1.5">
              
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {{ formatPrice(item.document?.variant_prices?.[0] || 0) }} ₽
                </span>
                <span v-if="(item.document?.variant_mrp?.[0] || 0) > (item.document?.variant_prices?.[0] || 0)" class="text-[11px] md:text-xs text-slate-400 dark:text-slate-500 font-medium line-through decoration-slate-300 dark:decoration-slate-600">
                  {{ formatPrice(item.document?.variant_mrp?.[0] || 0) }}
                </span>
              </div>

              <div class="flex items-center gap-2 mb-1">
                <span class="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-green-200/50 dark:border-green-800/50">
                   <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Ozon Card
                </span>
                <div class="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                   <span class="text-amber-400 text-xs">★</span> 4.9 <span class="text-slate-400 dark:text-slate-500">(128)</span>
                </div>
              </div>

              <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{{ item.document?.brand }}</div>
              <h3 class="text-[13px] leading-snug text-slate-700 dark:text-slate-300 font-medium line-clamp-2 h-[2.6em]">
                {{ item.document?.title || item.document?.brand || 'Premium Product' }}
              </h3>

              <div class="flex-1"></div>

              <button 
                class="mt-3 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
                @click.stop="addToCart(item)"
              >
                <span>Add to Cart</span>
                <svg class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
      </div><!-- end right content -->
    </div><!-- end flex layout -->

    <ContentEngine ref="cartPopupRef" v-bind="{ ce_file: _var.cart_popup.ce_file }" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import ContentEngine from './Contentengin.vue';
import ProductFilter from '../src/components/Productfilter.vue';
import type { _$p_TYP, _p_TYP, _$cb_TYP } from '../../shared/types';
import { createTemplate } from "bind-str";

const { _p, __p:_$p } = defineProps<{ _p: _p_TYP, __p: _$p_TYP }>();

const searchQuery = ref('');
const formProducts = ref<any[]>([]);
const apiProducts = ref<any[]>([]);
const products = computed(() => [...formProducts.value, ...apiProducts.value]);
const activeFilterByString = ref<string>('');
const isDark = ref(false);
const loading = ref(true);
const loadingMore = ref(false);
const page = ref(1);
const hasMore = ref(true);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// listen for real-time form updates via window event (cross-app boundary)
const _onFormChange = (e: Event) => {
  const list: any[] = (e as CustomEvent).detail?.value?.l ?? [];
  formProducts.value = list.map((p: any) => ({
    _fromForm: true,
    document: {
      id: `form-${p.title}`,
      title: p.title || 'Untitled',
      brand: 'My Store',
      variant_prices: [Number(p.price) || 0],
      variant_mrp: [],
      slug: '',
    },
    images: p.image ? [p.image] : [],
    activeIdx: 0,
    interval: null,
  }));
};
window.addEventListener('product:form:change', _onFormChange);

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
    page.value = 1; apiProducts.value = []; hasMore.value = true; loading.value = true;
    fetchProducts();
  }
};

const initTheme = () => {
  const saved = localStorage.getItem('theme');
  isDark.value = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', isDark.value);
};

const handleSearch = async () => {
  loading.value = true; apiProducts.value = []; page.value = 1; hasMore.value = true;
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
        apiProducts.value.push({ document: curr, images: getImages(curr), activeIdx: 0, interval: null });
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
  btn.classList.toggle('text-red-500');
  btn.classList.toggle('bg-red-50');
  btn.classList.toggle('dark:bg-red-500/20');
};

onMounted(() => {
  initTheme();
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('q')) searchQuery.value = urlParams.get('q') || '';
  handleSearch().then(() => setTimeout(() => setupObserver(), 100));
});
onUnmounted(() => { if (observer) observer.disconnect(); window.removeEventListener('product:form:change', _onFormChange); });
</script>

<style>
/* Shimmer Animation */
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Hide sidebar on mobile */
@media (max-width: 767px) {
  .desktop-sidebar-hide {
    display: none !important;
  }
}

/* Custom Styled Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-thumb {
  background: #334155;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
