<template>
  <div>
    <!-- Floating Filter Button (all screen sizes) -->
    <Teleport to="body">
      <div class="fixed bottom-6 right-6 z-40">
        <button @click="mobileFilterOpen = true"
          :class="[
            'text-white px-5 py-3.5 rounded-full shadow-2xl font-bold flex items-center gap-2 uppercase tracking-wide active:scale-95 transition-transform duration-200',
            currentTheme === 'dark' ? 'bg-pink-500 hover:bg-pink-600' : 'bg-pink-600 hover:bg-pink-700'
          ]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          <span v-if="totalSelectedFilters > 0" class="bg-white text-pink-600 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">{{ totalSelectedFilters }}</span>
        </button>
      </div>

      <!-- Filter Drawer -->
      <transition name="slide-up">
        <div v-if="mobileFilterOpen"
          :class="['fixed inset-0 z-[110] flex flex-col overflow-hidden',
            currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
          ]">

          <div :class="['p-4 border-b flex justify-between items-center shrink-0',
            currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          ]">
            <h2 :class="['font-bold uppercase', currentTheme === 'dark' ? 'text-white' : 'text-gray-800']">Filters</h2>
            <div class="flex items-center gap-3">
              <button v-if="totalSelectedFilters > 0" @click="clearAllFilters"
                class="text-xs font-bold text-pink-600 uppercase">Clear All</button>
              <button @click="mobileFilterOpen = false"
                :class="['p-2 rounded-full', currentTheme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100']">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex-1 flex overflow-hidden">
            <!-- Tab list -->
            <div :class="['w-1/3 overflow-y-auto shrink-0', currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50']">
              <div v-for="group in visibleFilterGroups" :key="group.typ"
                @click="activeMobileTab = group.typ"
                :class="['p-4 text-[11px] font-bold uppercase border-l-4 transition-all h-16 flex items-center cursor-pointer',
                  activeMobileTab === group.typ
                    ? currentTheme === 'dark' ? 'bg-gray-900 border-pink-500 text-pink-400' : 'bg-white border-pink-500 text-pink-600'
                    : currentTheme === 'dark' ? 'border-transparent text-gray-400 hover:bg-gray-700' : 'border-transparent text-gray-500 hover:bg-gray-100'
                ]">
                {{ group.title }}
                <span v-if="appliedFilters[group.typ]?.length" class="ml-1 text-pink-500">•</span>
              </div>
            </div>

            <!-- Tab content -->
            <div :class="['w-2/3 overflow-y-auto p-4', currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white']">
              <div v-if="currentMobileGroup">
                <div v-if="currentMobileGroup.typ !== 'price'" class="mb-4">
                  <input v-model="groupSearchQueries[currentMobileGroup.typ]"
                    type="text" :placeholder="`Search ${currentMobileGroup.title}`"
                    :class="['w-full px-4 py-2 text-sm border rounded-lg focus:outline-none',
                      currentTheme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500' : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-500'
                    ]" />
                </div>

                <div class="space-y-3">
                  <template v-if="currentMobileGroup.typ === 'price'">
                    <div class="flex items-center gap-3 mt-2">
                      <input v-model="customPriceMin" type="number" placeholder="Min"
                        :class="['w-full px-3 py-2 text-sm border rounded-lg focus:outline-none',
                          currentTheme === 'dark' ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-pink-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-pink-500'
                        ]" />
                      <span :class="currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'">to</span>
                      <input v-model="customPriceMax" type="number" placeholder="Max"
                        :class="['w-full px-3 py-2 text-sm border rounded-lg focus:outline-none',
                          currentTheme === 'dark' ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-pink-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-pink-500'
                        ]" />
                    </div>
                    <button @click="applyCustomPrice"
                      class="mt-3 w-full py-2.5 text-sm font-bold text-white uppercase bg-pink-600 hover:bg-pink-700 rounded-lg">
                      Apply Price
                    </button>
                  </template>

                  <template v-else>
                    <div v-for="item in getFilteredMobileItems(currentMobileGroup)" :key="item.name"
                      @click="toggleFilter(currentMobileGroup.typ, item.name)"
                      :class="['flex items-center justify-between p-2 rounded-lg cursor-pointer',
                        currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                      ]">
                      <div class="flex items-center gap-3">
                        <div :class="['w-5 h-5 border rounded flex items-center justify-center',
                          isSelected(currentMobileGroup.typ, item.name)
                            ? 'bg-pink-500 border-pink-500'
                            : currentTheme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                        ]">
                          <svg v-if="isSelected(currentMobileGroup.typ, item.name)"
                            class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" stroke-width="3" />
                          </svg>
                        </div>
                        <span :class="['text-sm', isSelected(currentMobileGroup.typ, item.name)
                          ? 'font-medium text-gray-900 dark:text-white'
                          : currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        ]">{{ item.name }}</span>
                      </div>
                      <span :class="['text-[10px]', currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400']">{{ item.count }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div :class="['p-4 border-t flex gap-4 shrink-0',
            currentTheme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          ]">
            <button @click="clearAllFilters"
              :class="['flex-1 py-3 text-sm font-bold uppercase rounded-lg border',
                currentTheme === 'dark' ? 'text-gray-400 border-gray-700 hover:bg-gray-800' : 'text-gray-600 border-gray-300 hover:bg-gray-50'
              ]">Clear All</button>
            <button @click="mobileFilterOpen = false"
              class="flex-1 py-3 text-sm font-bold uppercase bg-pink-600 hover:bg-pink-700 text-white rounded-lg">
              Apply
            </button>
          </div>
        </div>
      </transition>

      <!-- Brand Directory Modal -->
      <transition name="fade">
        <div v-if="directoryOpen && currentDirGroup"
          class="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div :class="['w-full max-w-6xl h-[85vh] rounded-lg shadow-2xl flex flex-col overflow-hidden',
            currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
          ]">
            <div :class="['p-4 border-b flex items-center gap-4', currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200']">
              <div class="flex-shrink-0">
                <h3 :class="['text-lg font-bold', currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800']">Brand Directory</h3>
                <p :class="['text-xs', currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500']">{{ currentDirGroup.l?.length || 0 }} brands</p>
              </div>
              <div class="relative flex-1">
                <input v-model="dirSearchQuery" type="text" placeholder="Search brands"
                  :class="['w-full pl-10 pr-4 py-2 border rounded-full text-sm',
                    currentTheme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900 placeholder-gray-400'
                  ]" />
                <svg class="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" />
                </svg>
              </div>
              <button @click="directoryOpen = false"
                :class="['p-2 rounded-full', currentTheme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500']">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke-width="2" />
                </svg>
              </button>
            </div>
            <div class="flex-1 overflow-x-auto">
              <div ref="directoryContainer" class="flex min-h-full p-8 gap-8">
                <div v-for="(column, colIndex) in megaDirectoryColumns" :key="colIndex" class="w-64 flex-shrink-0">
                  <div v-for="letterGroup in column" :key="letterGroup.letter" :id="`dir-letter-${letterGroup.letter}`" class="mb-8">
                    <h3 class="text-xl font-bold text-pink-600 mb-4">{{ letterGroup.letter }}</h3>
                    <div class="space-y-2">
                      <div v-for="item in letterGroup.items" :key="item.name"
                        @click="toggleFilter(currentDirGroup.typ, item.name)"
                        :class="['flex items-center cursor-pointer p-2 rounded-lg', currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50']">
                        <div :class="['w-4 h-4 border rounded flex-shrink-0 flex items-center justify-center',
                          isSelected(currentDirGroup.typ, item.name) ? 'bg-pink-500 border-pink-500' : currentTheme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                        ]">
                          <svg v-if="isSelected(currentDirGroup.typ, item.name)" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" stroke-width="3" />
                          </svg>
                        </div>
                        <span :class="['ml-3 text-sm truncate', currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600']">{{ item.name }}</span>
                        <span :class="['text-[10px] ml-2 flex-shrink-0', currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400']">{{ item.count }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import type { FilterGroup, FilterConfig, FilterData, _$p_TYP } from "../../../shared/types"
import { createTemplate } from "bind-str"

const props = defineProps<{ _p: any, _$p: _$p_TYP, _$cb: any, config?: FilterConfig }>()

const _t_temp = createTemplate(props._$p.data.curr.data.api[`token`], { open: '<', close: '>' })
const API_TOKEN = _t_temp({ localStorage: { token: localStorage.getItem('token') || '' } }).replace('Bearer ', '')
const API_URL = props._$p.data.curr.data.api[`url`]?.split('?')[0]

const currentTheme = computed(() => props.config?.theme || filterData.value?.theme || 'light')

const isFilterLoading = ref(false)
const apiFilterData = ref<any>(null)
const appliedFilters = reactive<Record<string, any[]>>({})
const mobileFilterOpen = ref(false)
const activeMobileTab = ref('')
const searchQueryFromUrl = ref('')
const customPriceMin = ref<number | ''>('')
const customPriceMax = ref<number | ''>('')
const groupSearchQueries = reactive<Record<string, string>>({})
const directoryOpen = ref(false)
const currentDirGroup = ref<FilterGroup | null>(null)
const dirSearchQuery = ref('')
const directoryContainer = ref<HTMLElement | null>(null)

const buildFilterQuery = () => {
  const parts: string[] = []
  Object.entries(appliedFilters).forEach(([key, values]) => {
    if (!values || values.length === 0) return
    if (key === 'price') {
      const { min, max } = values[0]
      parts.push(`variant_prices:[${min}..${max}]`)
    } else {
      parts.push(values.length === 1 ? `${key}:=${values[0]}` : `${key}:=[${values.join(',')}]`)
    }
  })
  return parts.length > 0 ? parts.join(' && ') : null
}

const triggerUpdate = () => {
  updateUrlParams()
  const filterString = buildFilterQuery()
  console.log('🚀 [Filter] filter_by:', filterString)
  props._$cb?.change?.({ filter_by: filterString })
  fetchFilters(false)
}

const updateUrlParams = () => {
  const params = new URLSearchParams(window.location.search)
  if (searchQueryFromUrl.value) params.set('q', searchQueryFromUrl.value)
  Array.from(params.keys()).filter(k => k !== 'q').forEach(k => params.delete(k))
  Object.entries(appliedFilters).forEach(([key, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      params.set(key, key === 'price' && values[0]?.min !== undefined ? `${values[0].min},${values[0].max}` : values.join(','))
    }
  })
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
}

const parseUrlToState = () => {
  const params = new URLSearchParams(window.location.search)
  searchQueryFromUrl.value = params.get('q') || ''
  params.forEach((value, key) => {
    if (key === 'q') return
    if (key === 'price') {
      const [min, max] = value.split(',')
      appliedFilters.price = [{ min: Number(min), max: Number(max) }]
      customPriceMin.value = Number(min)
      customPriceMax.value = Number(max)
    } else {
      appliedFilters[key] = value.split(',')
    }
  })
}

const fetchFilters = async (showLoader = false) => {
  if (showLoader) isFilterLoading.value = true
  const filterByString = buildFilterQuery()
  const requestBody: any = {
    raw_text: searchQueryFromUrl.value || '_', q: searchQueryFromUrl.value || '*',
    query_by: 'title,brand,category', query_by_weights: '3,2,1',
    page: 1, per_page: 20, prioritize_exact_match: true, prefix: true,
    token_separators: '+&', num_typos: 1, drop_tokens_threshold: 1,
    facet_by: 'brand,category,color,size', max_facet_values: 100, collection: 'products'
  }
  if (filterByString) requestBody.filter_by = filterByString
  try {
    const res = await fetch(`${API_URL}?typ=get_filter_data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_TOKEN}` },
      body: JSON.stringify(requestBody)
    })
    const json = await res.json()
    if (json.success) apiFilterData.value = json
  } catch (e) {
    console.error('Filter API Error:', e)
  } finally {
    if (showLoader) isFilterLoading.value = false
  }
}

const filterData = computed<FilterData>(() => apiFilterData.value || props._$p?.data?.curr?.data || {})
const visibleFilterGroups = computed(() => filterData.value.filters || [])
const currentMobileGroup = computed(() => visibleFilterGroups.value.find(g => g.typ === activeMobileTab.value))

const totalSelectedFilters = computed(() =>
  Object.values(appliedFilters).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0)
)

const getFilteredMobileItems = (group: FilterGroup) => {
  if (!group?.l) return []
  const q = groupSearchQueries[group.typ]?.toLowerCase()
  return q ? group.l.filter(i => i.name.toLowerCase().includes(q)) : group.l
}

const isSelected = (typ: string, name: string) => {
  const arr = appliedFilters[typ]
  return Array.isArray(arr) ? arr.includes(name) : false
}

const toggleFilter = (typ: string, val: string) => {
  if (!appliedFilters[typ]) appliedFilters[typ] = []
  const arr = appliedFilters[typ] as string[]
  const idx = arr.indexOf(val)
  if (idx === -1) arr.push(val); else arr.splice(idx, 1)
  if (arr.length === 0) delete appliedFilters[typ]
  triggerUpdate()
}

const applyCustomPrice = () => {
  let min = customPriceMin.value !== '' ? Number(customPriceMin.value) : undefined
  let max = customPriceMax.value !== '' ? Number(customPriceMax.value) : undefined
  if (min !== undefined && max !== undefined && min > max) { [min, max] = [max, min]; customPriceMin.value = min; customPriceMax.value = max }
  if (min === undefined && max === undefined) { delete appliedFilters.price }
  else { appliedFilters.price = [{ min: min ?? 0, max: max ?? 9999999 }] }
  triggerUpdate()
}

const clearAllFilters = () => {
  for (const key in appliedFilters) delete appliedFilters[key]
  customPriceMin.value = ''
  customPriceMax.value = ''
  triggerUpdate()
}

const megaDirectoryColumns = computed(() => {
  if (!currentDirGroup.value?.l) return []
  const filtered = currentDirGroup.value.l.filter(i => i.name.toLowerCase().includes(dirSearchQuery.value.toLowerCase()))
  const groups: Record<string, any[]> = {}
  filtered.forEach(item => {
    let char = item.name.charAt(0).toUpperCase()
    if (!/[A-Z]/.test(char)) char = '#'
    if (!groups[char]) groups[char] = []
    groups[char].push(item)
  })
  const letterGroups = Object.keys(groups).sort().map(letter => ({ letter, items: groups[letter], height: groups[letter].length * 32 + 60 }))
  const columns: Array<Array<{ letter: string, items: any[] }>> = [[]]
  let col = 0, colH = 0
  letterGroups.forEach(g => {
    if (colH + g.height > 600 && colH > 0) { columns.push([]); col++; colH = 0 }
    columns[col].push({ letter: g.letter, items: g.items })
    colH += g.height
  })
  return columns
})

watch(visibleFilterGroups, (newVal) => {
  if (newVal.length > 0 && !activeMobileTab.value) activeMobileTab.value = newVal[0].typ
}, { immediate: true })

onMounted(async () => {
  parseUrlToState()
  props._$cb?.change?.({ filter_by: buildFilterQuery() })
  await fetchFilters(true)
  if (visibleFilterGroups.value.length > 0) activeMobileTab.value = visibleFilterGroups.value[0].typ
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
.w-1\/3 { border-right: 1px solid rgba(0,0,0,0.05); }
</style>
