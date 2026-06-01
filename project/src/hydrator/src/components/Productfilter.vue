<template>
  <div :class="['dark-mode-wrapper', { 'dark': currentTheme === 'dark' }]">
    <div class="md:hidden fixed bottom-6 right-6 z-40">
      <button @click="mobileFilterOpen = true" 
        :class="['bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 text-white px-6 py-4 rounded-full shadow-2xl font-bold flex items-center gap-2 uppercase tracking-wide active:scale-95 transition-transform duration-200',
          currentTheme === 'dark' ? 'dark:bg-pink-500 dark:hover:bg-pink-600' : ''
        ]">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </button>
    </div>

    <aside :class="['hidden md:flex flex-col product-filter w-80 border-r h-screen sticky top-0',
      currentTheme === 'dark' 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'
    ]">

      <div :class="['p-4 border-b flex justify-between items-center z-10',
        currentTheme === 'dark' 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
      ]">
        <h2 :class="['text-md font-bold uppercase',
          currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'
        ]">Filters</h2>
        <button v-if="totalSelectedFilters > 0" 
          @click="clearAllFilters" 
          class="text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 uppercase transition-colors duration-200">
          Clear All
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isFilterLoading" class="p-10 flex justify-center">
          <div :class="['w-6 h-6 border-2 rounded-full animate-spin',
            currentTheme === 'dark' 
              ? 'border-pink-400 border-t-transparent' 
              : 'border-pink-500 border-t-transparent'
          ]"></div>
        </div>

        <template v-else>
          <div v-for="filterGroup in visibleFilterGroups" 
            :key="filterGroup.typ" 
            :class="['border-b p-4',
              currentTheme === 'dark' 
                ? 'border-gray-800' 
                : 'border-gray-100'
            ]">
            
            <div class="flex items-center justify-between mb-3">
              <span :class="['text-sm font-bold uppercase',
                currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              ]">{{ filterGroup.title }}</span>
              <button @click="toggleSearch(filterGroup.typ)" 
                :class="['p-1.5 rounded-full transition-colors duration-200',
                  currentTheme === 'dark' 
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300' 
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                ]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" />
                </svg>
              </button>
            </div>

            <transition name="expand" @enter="onExpandEnter" @after-enter="onExpandAfterEnter" @leave="onExpandLeave">
              <div v-if="activeSearchGroups[filterGroup.typ]" class="mb-3">
                <input v-model="groupSearchQueries[filterGroup.typ]" 
                  type="text" 
                  :placeholder="`Search ${filterGroup.title}`"
                  :class="['w-full px-3 py-1.5 text-xs border rounded-full focus:outline-none transition-colors duration-200',
                    currentTheme === 'dark'
                      ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-pink-500'
                      : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-pink-500'
                  ]" />
              </div>
            </transition>

            <div class="space-y-2">
              <template v-if="filterGroup.typ === 'price'">
                <div class="flex items-center gap-2 mt-2">
                  <input v-model="customPriceMin" type="number" placeholder="Min"
                    :class="['w-full px-2 py-1.5 text-sm border rounded focus:outline-none transition-colors duration-200',
                      currentTheme === 'dark' ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-pink-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-pink-500'
                    ]" />
                  <span :class="currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'">-</span>
                  <input v-model="customPriceMax" type="number" placeholder="Max"
                    :class="['w-full px-2 py-1.5 text-sm border rounded focus:outline-none transition-colors duration-200',
                      currentTheme === 'dark' ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-pink-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-pink-500'
                    ]" />
                </div>
                <button @click="applyCustomPrice"
                  class="mt-3 w-full py-1.5 text-xs font-bold text-white uppercase bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 rounded transition-colors duration-200">
                  Apply Price
                </button>
              </template>

              <template v-else>
                <div v-for="item in getFilteredAndTruncatedItems(filterGroup)" 
                  :key="item.name" 
                  @click="toggleFilter(filterGroup.typ, item.name)"
                  :class="['flex items-center cursor-pointer group transition-colors duration-200',
                    currentTheme === 'dark' 
                      ? 'hover:bg-gray-800 rounded-lg p-1' 
                      : 'hover:bg-gray-50 rounded-lg p-1'
                  ]">
                  
                  <div :class="['w-4 h-4 border rounded flex items-center justify-center transition-all duration-200',
                    isSelected(filterGroup.typ, item.name) 
                      ? 'bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600' 
                      : currentTheme === 'dark'
                        ? 'bg-gray-800 border-gray-600 group-hover:border-gray-400'
                        : 'bg-white border-gray-300 group-hover:border-gray-400'
                  ]">
                    <svg v-if="isSelected(filterGroup.typ, item.name)" 
                      class="w-3 h-3 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke-width="3" />
                    </svg>
                  </div>
                  
                  <span :class="['ml-3 text-sm flex-1 truncate transition-colors duration-200',
                    isSelected(filterGroup.typ, item.name)
                      ? 'font-medium dark:text-white text-gray-900'
                      : currentTheme === 'dark'
                        ? 'text-gray-400 group-hover:text-gray-300'
                        : 'text-gray-600 group-hover:text-gray-900'
                  ]">{{ item.name }}</span>
                  
                  <span :class="['text-[10px] ml-2',
                    currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  ]">{{ item.count }}</span>
                </div>

                <div v-if="shouldShowMoreButton(filterGroup)" class="mt-2">
                  <button v-if="filterGroup.typ === 'brand'" 
                    @click="openDirectory(filterGroup)" 
                    class="text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 hover:underline transition-colors duration-200">
                    + {{ filterGroup.l.length - 5 }} more
                  </button>
                  <button v-else 
                    @click="toggleShowAll(filterGroup.typ)"
                    class="text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 hover:underline transition-colors duration-200">
                    {{ expandedItems[filterGroup.typ] ? 'Show Less' : `+ ${filterGroup.l.length - 5} more` }}
                  </button>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </aside>

    <Teleport to="body">
      <transition name="slide-up">
        <div v-if="mobileFilterOpen" 
          :class="['fixed inset-0 z-[110] flex flex-col md:hidden overflow-hidden',
            currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
          ]">
          
          <div :class="['p-4 border-b flex justify-between items-center shrink-0',
            currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          ]">
            <h2 :class="['font-bold uppercase',
              currentTheme === 'dark' ? 'text-white' : 'text-gray-800'
            ]">Filters</h2>
            <button @click="mobileFilterOpen = false" 
              :class="['p-2 rounded-full transition-colors duration-200',
                currentTheme === 'dark' 
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              ]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke-width="2"/>
              </svg>
            </button>
          </div>

          <div class="flex-1 flex overflow-hidden">
            <div :class="['w-1/3 overflow-y-auto',
              currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            ]">
              <div v-for="group in visibleFilterGroups" 
                :key="group.typ" 
                @click="activeMobileTab = group.typ"
                :class="['p-4 text-[11px] font-bold uppercase border-l-4 transition-all h-16 flex items-center',
                  activeMobileTab === group.typ
                    ? currentTheme === 'dark'
                      ? 'bg-gray-900 border-pink-500 text-pink-400'
                      : 'bg-white border-pink-500 text-pink-600'
                    : currentTheme === 'dark'
                      ? 'border-transparent text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                      : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                ]">
                {{ group.title }}
                <span v-if="appliedFilters[group.typ]?.length" 
                  class="ml-1 text-pink-500 dark:text-pink-400">•</span>
              </div>
            </div>

            <div :class="['w-2/3 overflow-y-auto p-4',
              currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
            ]">
              <div v-if="currentMobileGroup">
                <div v-if="currentMobileGroup.typ !== 'price'" class="mb-4">
                  <input v-model="groupSearchQueries[currentMobileGroup.typ]" 
                    type="text" 
                    :placeholder="`Search ${currentMobileGroup.title}`"
                    :class="['w-full px-4 py-2 text-sm border rounded-lg transition-colors duration-200',
                      currentTheme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500'
                        : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-500'
                    ]" />
                </div>

                <div class="space-y-5">
                  <template v-if="currentMobileGroup.typ === 'price'">
                    <div class="flex items-center gap-3 px-2 mt-2">
                      <input v-model="customPriceMin" type="number" placeholder="Min"
                        :class="['w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-colors duration-200',
                          currentTheme === 'dark' ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-pink-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-pink-500'
                        ]" />
                      <span :class="currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'">to</span>
                      <input v-model="customPriceMax" type="number" placeholder="Max"
                        :class="['w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-colors duration-200',
                          currentTheme === 'dark' ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-pink-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-pink-500'
                        ]" />
                    </div>
                    <div class="px-2">
                      <button @click="applyCustomPrice"
                        class="mt-4 w-full py-2.5 text-sm font-bold text-white uppercase bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 rounded-lg transition-colors duration-200">
                        Apply Price
                      </button>
                    </div>
                  </template>
                  
                  <template v-else>
                    <div v-for="item in getFilteredMobileItems(currentMobileGroup)" 
                      :key="item.name" 
                      @click="toggleFilter(currentMobileGroup.typ, item.name)"
                      :class="['flex items-center justify-between p-2 rounded-lg transition-colors duration-200 cursor-pointer',
                        currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                      ]">
                      <div class="flex items-center gap-3">
                        <div :class="['w-5 h-5 border rounded flex items-center justify-center transition-all duration-200',
                          isSelected(currentMobileGroup.typ, item.name)
                            ? 'bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600'
                            : currentTheme === 'dark'
                              ? 'border-gray-600'
                              : 'border-gray-300'
                        ]">
                          <svg v-if="isSelected(currentMobileGroup.typ, item.name)" 
                            class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" stroke-width="3" />
                          </svg>
                        </div>
                        <span :class="['text-sm transition-colors duration-200',
                          isSelected(currentMobileGroup.typ, item.name)
                            ? 'dark:text-white text-gray-900 font-medium'
                            : currentTheme === 'dark'
                              ? 'text-gray-200'
                              : 'text-gray-700'
                        ]">{{ item.name }}</span>
                      </div>
                      <span :class="['text-[10px]', currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400']">
                        {{ item.count }}
                      </span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div :class="['p-4 border-t flex gap-4 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]',
            currentTheme === 'dark' 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-200'
          ]">
            <button @click="clearAllFilters" 
              :class="['flex-1 py-3 text-sm font-bold uppercase rounded-lg transition-colors duration-200',
                currentTheme === 'dark'
                  ? 'text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-gray-300'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              ]">Clear All</button>
            <button @click="mobileFilterOpen = false" 
              class="flex-1 py-3 text-sm font-bold uppercase bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 text-white rounded-lg transition-colors duration-200">
              Apply
            </button>
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <transition name="fade">
        <div v-if="directoryOpen && currentDirGroup"
          class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div :class="['w-full max-w-6xl h-[85vh] rounded-lg shadow-2xl flex flex-col overflow-hidden',
            currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
          ]">

            <div :class="['p-6 border-b flex items-center gap-4',
              currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            ]">
              <div class="flex-shrink-0">
                <h3 :class="['text-lg font-bold',
                  currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                ]">Brand Directory</h3>
                <p :class="['text-xs',
                  currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                ]">Select from {{ currentDirGroup.l?.length || 0 }} brands</p>
              </div>

              <div class="relative flex-1">
                <input v-model="dirSearchQuery" 
                  type="text" 
                  placeholder="Search brands by name"
                  :class="['w-full pl-10 pr-4 py-2 border rounded-full text-sm transition-colors duration-200',
                    currentTheme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500'
                      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-500'
                  ]" />
                <svg class="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" />
                </svg>
              </div>

              <div :class="['flex-1 flex items-center gap-1 overflow-x-auto scrollbar-custom-alphabet px-2 border-x pb-2 pt-1',
                currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              ]">
                <button v-for="char in alphabet" 
                  :key="char" 
                  @click="scrollToLetter(char)"
                  :class="['px-3 py-1 text-xs font-bold uppercase flex-shrink-0 transition-colors duration-200',
                    currentTheme === 'dark'
                      ? 'text-gray-400 hover:text-pink-400'
                      : 'text-gray-400 hover:text-pink-600'
                  ]">
                  {{ char }}
                </button>
              </div>

              <button @click="directoryOpen = false"
                :class="['p-2 flex-shrink-0 rounded-full transition-colors duration-200',
                  currentTheme === 'dark'
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                ]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke-width="2" />
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-x-auto custom-scrollbar-horizontal">
              <div ref="directoryContainer" class="flex min-h-full p-8 gap-8">
                <div v-for="(column, colIndex) in megaDirectoryColumns" 
                  :key="colIndex" 
                  class="w-64 flex-shrink-0">
                  <div v-for="(letterGroup, index) in column" 
                    :key="letterGroup.letter"
                    :id="`dir-letter-${letterGroup.letter}`"
                    :class="['mb-8 scroll-ml-8', { 'last:mb-0': index === column.length - 1 }]">

                    <h3 class="text-xl font-bold text-pink-600 dark:text-pink-500 mb-4">
                      {{ letterGroup.letter }}
                    </h3>

                    <div class="space-y-3">
                      <div v-for="item in letterGroup.items" 
                        :key="item.name"
                        @click="toggleFilter(currentDirGroup.typ, item.name)"
                        :class="['flex items-center cursor-pointer group p-2 rounded-lg transition-colors duration-200',
                          currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                        ]">
                        
                        <div :class="['w-4 h-4 border rounded flex-shrink-0 flex items-center justify-center transition-all duration-200',
                          isSelected(currentDirGroup.typ, item.name)
                            ? 'bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600'
                            : currentTheme === 'dark'
                              ? 'bg-gray-800 border-gray-600 group-hover:border-gray-400'
                              : 'border-gray-300 group-hover:border-gray-400'
                        ]">
                          <svg v-if="isSelected(currentDirGroup.typ, item.name)" 
                            class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" stroke-width="3" />
                          </svg>
                        </div>
                        
                        <span :class="['ml-3 text-sm truncate transition-colors duration-200',
                          isSelected(currentDirGroup.typ, item.name)
                            ? 'dark:text-white text-gray-900 font-medium'
                            : currentTheme === 'dark'
                              ? 'text-gray-400 group-hover:text-gray-300'
                              : 'text-gray-600 group-hover:text-gray-900'
                        ]">
                          {{ item.name }}
                        </span>
                        
                        <span :class="['text-[10px] ml-2 flex-shrink-0',
                          currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        ]">
                          {{ item.count }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="megaDirectoryColumns.length === 0" class="w-full flex items-center justify-center">
                  <div class="text-center">
                    <svg :class="['w-16 h-16 mx-auto mb-4',
                      currentTheme === 'dark' ? 'text-gray-700' : 'text-gray-300'
                    ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p :class="['mb-1', currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500']">No results found</p>
                    <p :class="['text-sm', currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400']">Try a different search term</p>
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
import { ref, computed, reactive, onMounted, watch, nextTick } from 'vue'
import type { FilterGroup, AppliedFilters, FilterConfig, FilterData, _$p_TYP } from "../../../shared/types"

const props = defineProps<{ _p: any, _$p: _$p_TYP, _$cb: _$p_TYP, config?: FilterConfig }>()

// --- THEME HANDLING ---
const currentTheme = computed(() => {
  return props.config?.theme || filterData.value?.theme || 'light'
})

// --- STATE ---
const isFilterLoading = ref(false)
const apiFilterData = ref<any>(null)
const appliedFilters = reactive<Record<string, any[]>>({})
const mobileFilterOpen = ref(false)
const activeMobileTab = ref('')
const searchQueryFromUrl = ref('') 

// Custom price inputs
const customPriceMin = ref<number | ''>('')
const customPriceMax = ref<number | ''>('')

// --- FILTER QUERY BUILDER (STRICT TYPESENSE FORMAT) ---
const buildFilterQuery = () => {
  const queryParts: string[] = [];

  Object.entries(appliedFilters).forEach(([key, values]) => {
    if (!values || values.length === 0) return;

    if (key === 'price') {
      const { min, max } = values[0];
      // Guarantees EXACT format: variant_prices:[1000..2000]
      queryParts.push(`variant_prices:[${min}..${max}]`);
    } else {
      const fieldName = key; 
      if (values.length === 1) {
        queryParts.push(`${fieldName}:=${values[0]}`);
      } else {
        const multiValues = values.map(v => `${v}`).join(',');
        queryParts.push(`${fieldName}:=[${multiValues}]`);
      }
    }
  });

  return queryParts.length > 0 ? queryParts.join(' && ') : null;
};

// --- CENTRAL UPDATE TRIGGER ---
const triggerUpdate = () => {
  updateUrlParams();
  
  const filterString = buildFilterQuery();
  
  // 🚀 LOGGING FOR DEBUGGING: Open your DevTools Console to see this!
  console.log("🚀 [Filter Component] Emitting exact filter string to parent:", filterString);
  
  // Emit the exact string to the parent component!
  // NOTE: Your parent component (which calls get_product_list) MUST use this emitted value.
  props._$cb?.change?.({ 
    filter_by: filterString 
  });

  // Re-fetch the filter sidebar counts
  fetchFilters(false);
};

// --- TRANSITION HELPERS ---
const onExpandEnter = (el: Element) => {
  const e = el as HTMLElement;
  e.style.height = 'auto';
  const h = e.scrollHeight;
  e.style.height = '0px';
  e.offsetHeight; 
  e.style.height = h + 'px';
}
const onExpandAfterEnter = (el: Element) => {
  (el as HTMLElement).style.height = 'auto';
}
const onExpandLeave = (el: Element) => {
  const e = el as HTMLElement;
  e.style.height = e.scrollHeight + 'px';
  e.offsetHeight; 
  e.style.height = '0px';
}

// --- URL SYNC LOGIC ---
const updateUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  
  if (searchQueryFromUrl.value) params.set('q', searchQueryFromUrl.value);

  const keysToDelete = Array.from(params.keys()).filter(k => k !== 'q');
  keysToDelete.forEach(k => params.delete(k));

  Object.entries(appliedFilters).forEach(([key, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      if (key === 'price' && values[0]?.min !== undefined) {
        params.set(key, `${values[0].min},${values[0].max}`);
      } else {
        params.set(key, values.join(','));
      }
    }
  });

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
};

const parseUrlToState = () => {
  const params = new URLSearchParams(window.location.search);
  searchQueryFromUrl.value = params.get('q') || '';

  params.forEach((value, key) => {
    if (key !== 'q') {
      if (key === 'price') {
        const [min, max] = value.split(',');
        appliedFilters.price = [{ min: Number(min), max: Number(max) }];
        
        customPriceMin.value = Number(min);
        customPriceMax.value = Number(max);
      } else {
        appliedFilters[key] = value.split(',');
      }
    }
  });
};

// --- API FETCH LOGIC ---
const fetchFilters = async (showLoader = false) => {
  if (showLoader) isFilterLoading.value = true;
  const authToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk';

  const filterByString = buildFilterQuery();

  const requestBody: any = {
    raw_text: searchQueryFromUrl.value || "_",
    q: searchQueryFromUrl.value || "*",
    query_by: "title,brand,category",
    query_by_weights: "3,2,1",
    page: 1,
    per_page: 20,
    prioritize_exact_match: true,
    prefix: true,
    token_separators: "+&",
    num_typos: 1,
    drop_tokens_threshold: 1,
    facet_by: "brand,category,color,size",
    max_facet_values: 100,
    collection: "products"
  };

  // Only attach filter_by if it has a value, otherwise omit it completely
  if (filterByString) {
    requestBody.filter_by = filterByString;
  }

  try {
    const response = await fetch('https://fastapi.dryutil.1mn.io/client/api/i/ona/product_dir?typ=get_filter_data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify(requestBody)
    });
    const json = await response.json();
    if (json.success) {
      apiFilterData.value = json; 
    }
  } catch (e) {
    console.error("Filter API Error:", e);
  } finally {
    if (showLoader) isFilterLoading.value = false;
  }
};

const getFilteredMobileItems = (group: FilterGroup) => {
  if (!group || !group.l) return []
  const query = groupSearchQueries[group.typ]?.toLowerCase()
  if (query) {
    return group.l.filter(i => i.name.toLowerCase().includes(query))
  }
  return group.l 
}

const activeSearchGroups = reactive<Record<string, boolean>>({})
const groupSearchQueries = reactive<Record<string, string>>({})
const expandedItems = reactive<Record<string, boolean>>({})

// --- DIRECTORY LOGIC ---
const directoryOpen = ref(false)
const currentDirGroup = ref<FilterGroup | null>(null)
const dirSearchQuery = ref('')
const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const directoryContainer = ref<HTMLElement | null>(null)

const megaDirectoryColumns = computed(() => {
  if (!currentDirGroup.value || !currentDirGroup.value.l) return []

  const filtered = currentDirGroup.value.l.filter(i =>
    i.name.toLowerCase().includes(dirSearchQuery.value.toLowerCase())
  )

  const groups: Record<string, any[]> = {}
  filtered.forEach(item => {
    let char = item.name.charAt(0).toUpperCase()
    if (!/[A-Z]/.test(char)) char = '#'
    if (!groups[char]) groups[char] = []
    groups[char].push(item)
  })

  const sortedLetters = Object.keys(groups).sort()
  const letterGroups = sortedLetters.map(letter => ({
    letter,
    items: groups[letter],
    height: groups[letter].length * 32 + 60 
  }))

  const columns: Array<Array<{ letter: string, items: any[] }>> = [[]]
  let currentColumn = 0
  let currentColumnHeight = 0
  const maxColumnHeight = 600 

  letterGroups.forEach(group => {
    if (currentColumnHeight + group.height > maxColumnHeight && currentColumnHeight > 0) {
      columns.push([])
      currentColumn++
      currentColumnHeight = 0
    }
    columns[currentColumn].push({
      letter: group.letter,
      items: group.items
    })
    currentColumnHeight += group.height
  })

  return columns
})

const scrollToLetter = (letter: string) => {
  nextTick(() => {
    const el = document.getElementById(`dir-letter-${letter}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  });
};

const openDirectory = (group: FilterGroup) => {
  if (group.typ !== 'brand') return;
  currentDirGroup.value = group
  dirSearchQuery.value = ''
  directoryOpen.value = true
}

const filterData = computed<FilterData>(() => apiFilterData.value || props._$p?.data?.curr?.data || {})
const visibleFilterGroups = computed(() => filterData.value.filters || [])

const currentMobileGroup = computed(() => {
  return visibleFilterGroups.value.find(g => g.typ === activeMobileTab.value)
})

watch(visibleFilterGroups, (newVal) => {
  if (newVal.length > 0 && !activeMobileTab.value) {
    activeMobileTab.value = newVal[0].typ
  }
}, { immediate: true })

const totalSelectedFilters = computed(() => {
  return Object.values(appliedFilters).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0)
})

const toggleSearch = (typ: string) => {
  activeSearchGroups[typ] = !activeSearchGroups[typ]
  if (!activeSearchGroups[typ]) groupSearchQueries[typ] = ''
}

const toggleShowAll = (typ: string) => {
  expandedItems[typ] = !expandedItems[typ]
}

const getFilteredAndTruncatedItems = (group: FilterGroup) => {
  if (!group || !group.l) return [];
  let items = group.l;

  const query = groupSearchQueries[group.typ]?.toLowerCase()
  if (query) {
    return items.filter(i => i.name.toLowerCase().includes(query))
  }
  if (group.typ === 'brand') {
    return items.slice(0, 5)
  }
  if (!expandedItems[group.typ]) {
    return items.slice(0, 5)
  }
  return items
}

const shouldShowMoreButton = (group: FilterGroup) => {
  const query = groupSearchQueries[group.typ]
  if (query) return false
  return group.l && group.l.length > 5
}

// --- SELECTION LOGIC ---
const isSelected = (typ: string, name: string) => {
  const arr = appliedFilters[typ];
  return Array.isArray(arr) ? arr.includes(name) : false;
}

const toggleFilter = (typ: string, val: string) => {
  if (!appliedFilters[typ]) appliedFilters[typ] = [];
  const arr = appliedFilters[typ] as string[];
  const idx = arr.indexOf(val);
  
  if (idx === -1) arr.push(val);
  else arr.splice(idx, 1);

  if (arr.length === 0) delete appliedFilters[typ];

  triggerUpdate(); // <--- Emits the updated string
};

// --- CUSTOM PRICE LOGIC ---
const applyCustomPrice = () => {
  let min = customPriceMin.value !== '' ? Number(customPriceMin.value) : undefined;
  let max = customPriceMax.value !== '' ? Number(customPriceMax.value) : undefined;
  
  if (min !== undefined && max !== undefined && min > max) {
    const temp = min;
    min = max;
    max = temp;
    
    customPriceMin.value = min;
    customPriceMax.value = max;
  }
  
  if (min === undefined && max === undefined) {
    delete appliedFilters.price;
  } else {
    appliedFilters.price = [{ 
      min: min !== undefined ? min : 0, 
      max: max !== undefined ? max : 9999999 
    }];
  }
  
  triggerUpdate(); // <--- Emits the updated string
};

const clearAllFilters = async () => {
  for (const key in appliedFilters) delete appliedFilters[key];
  
  customPriceMin.value = '';
  customPriceMax.value = '';

  triggerUpdate(); // <--- Emits the updated string
};

onMounted(async () => {
  parseUrlToState();
  
  // IMMEDIATELY EMIT INITIAL STATE TO PARENT! 
  // (Crucial for when the page is refreshed with ?price=1000,2000 in the URL)
  const initialFilter = buildFilterQuery();
  props._$cb?.change?.({ filter_by: initialFilter });
  
  await fetchFilters(true); 
  
  if (visibleFilterGroups.value.length > 0) {
    activeMobileTab.value = visibleFilterGroups.value[0].typ;
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

.expand-enter-active, .expand-leave-active { transition: height 0.3s ease; overflow: hidden; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { display: flex; white-space: nowrap; -webkit-overflow-scrolling: touch; }
.custom-scrollbar-horizontal { scroll-behavior: smooth; scroll-padding-left: 2rem; }

.scrollbar-custom-alphabet::-webkit-scrollbar { height: 3px; }
.scrollbar-custom-alphabet::-webkit-scrollbar-track { background: transparent; }
.scrollbar-custom-alphabet::-webkit-scrollbar-thumb { background: #fbcfe8; border-radius: 10px; }
.scrollbar-custom-alphabet:hover::-webkit-scrollbar-thumb { background: #f472b6; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.w-1\/3 { border-right: 1px solid rgba(0,0,0,0.05); }
.dark .w-1\/3 { border-right: 1px solid rgba(255,255,255,0.05); }
</style>