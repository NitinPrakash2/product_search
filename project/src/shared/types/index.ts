// ==========================================
// SYSTEM TYPES (Event & Component Config)
// ==========================================

export type _$ = {
  type: string;
  _p: any;
  _$p: any;
  custom?: any;
  $d?: any;
  el?: any;
};

export type Events = "msg";

export type _p_TYP = {
  my: any;
  f: {
    name: (v: string) => string;
    get_lib: (v: { name: string; run_from: any }) => any;
    set_theme: (v: { name: string; el_id: string }) => any;
    path: (v: string) => string;
    uuid: () => string;
    wait_until: (conditionFn: () => boolean, interval?: number) => Promise<void>;
    call: (event: Events, _$: _$) => any;
    listen: (event: Events, handler: (_$: _$) => any | Promise<any>) => any;
    new_emitter: () => {
      emit: (event: Events, _$: _$) => any;
      on: (event: Events, handler: (_$: _$) => any | Promise<any>) => any;
    };
  };
};

export type _$p_TYP = {
  data: {
    curr: {
      id: string;
      type: string;
      data: {
        api?: any;         // Changed to any for flexibility
        cart_popup?: any;  // Changed to any for flexibility
        mode?: string;
        data?: string; 
        [key: string]: any; 
        event: any,
      };
    };
  };
};

export type _$cb_TYP = {
  change?: (event: any) => void;
  add?: (_v: { $d: any; el: HTMLElement }) => any; // Relaxed $d type
  [key: string]: any;
};


// ==========================================
// PRODUCT LIST TYPES (Relaxed to 'any')
// ==========================================

export interface ProductItem {
  document: any; // Relaxed to any to fix undefined errors
}

export interface ProductApiResponse {
  success: boolean;
  data: any; // Relaxed to any
}


// ==========================================
// FILTER TYPES
// ==========================================

export interface FilterItem {
  name: string;
  count: number;
  selected: boolean;
  min?: number;      
  max?: number;      
  value?: string;    
}

export interface FilterGroup {
  title: string;
  typ: string; // Relaxed from strict union string to general string
  l: FilterItem[];
  collapsed?: boolean;
  visible?: boolean;
}

export interface FilterData {
  raw_text?: string;
  collection?: string;
  filters?: FilterGroup[];
  sattr_k?: string;
  sattr_v?: string;
  sattr_page?: number;
  sattr_per_page?: number;
  theme?: 'light' | 'dark';
  
  success?: boolean;
  search_combination?: any; // Relaxed to any
  meta?: any; // Relaxed to any
}

export interface AppliedFilters {
  [key: string]: any; // Relaxed to any
}

export interface FilterConfig {
  theme?: 'light' | 'dark';
  layout?: 'sidebar' | 'modal' | 'drawer' | string;
  showCounts?: boolean;
  showClearAll?: boolean;
  showApplyButton?: boolean;
  showResetButton?: boolean;
  defaultExpanded?: boolean;
  mobileBreakpoint?: number;
  showPriceInput?: boolean;
  showColorSwatches?: boolean;
  showRatingStars?: boolean;
  maxVisibleItems?: number;
  searchInFilters?: boolean;
}

export interface FilterEvents {
  onFilterChange: (appliedFilters: any) => void;
  onSearch: (searchData: any) => void;
  onClearAll: () => void;
  onApply: () => void;
  onReset: () => void;
}

// ==========================================
// CONSTANTS & MAPPINGS
// ==========================================

export const COLOR_MAP: Record<string, string> = {
  'Red': 'bg-red-500',
  'Blue': 'bg-blue-500',
  'Green': 'bg-green-500',
  'Black': 'bg-black',
  'White': 'bg-white border border-gray-300',
  'Gray': 'bg-gray-400',
  'Yellow': 'bg-yellow-400',
  'Orange': 'bg-orange-500',
  'Purple': 'bg-purple-500',
  'Pink': 'bg-pink-500',
  'Brown': 'bg-yellow-800',
  'Navy': 'bg-blue-900',
  'Beige': 'bg-yellow-100',
  'Maroon': 'bg-red-800',
  'Teal': 'bg-teal-500',
  'Cyan': 'bg-cyan-400',
  'Lavender': 'bg-purple-200',
  'Multicolor': 'bg-gradient-to-r from-red-400 via-purple-500 to-blue-400'
};

export const SIZE_MAP: Record<string, string[]> = {
  'International': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  'US': ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'],
  'UK': ['4', '6', '8', '10', '12', '14', '16', '18', '20'],
  'EU': ['32', '34', '36', '38', '40', '42', '44', '46', '48'],
  'Shoes': ['6', '7', '8', '9', '10', '11', '12', '13'],
  'Accessories': ['One Size', 'Free Size']
};

export const CLOTHING_FILTERS = {
  sleeve_length: ['Short Sleeve', 'Long Sleeve', '3/4 Sleeve', 'Sleeveless', 'Cap Sleeve'],
  neck_type: ['Round Neck', 'V-Neck', 'Polo Neck', 'Turtle Neck', 'Henley', 'Boat Neck'],
  fit: ['Regular Fit', 'Slim Fit', 'Oversized', 'Relaxed Fit', 'Tailored Fit', 'Athletic Fit'],
  pattern: ['Solid', 'Striped', 'Checked', 'Printed', 'Floral', 'Geometric', 'Abstract', 'Camo'],
  material: ['Cotton', 'Polyester', 'Linen', 'Silk', 'Wool', 'Denim', 'Leather', 'Synthetic', 'Blend'],
  occasion: ['Casual', 'Formal', 'Sports', 'Party', 'Wedding', 'Work', 'Vacation', 'Everyday'],
  season: ['Summer', 'Winter', 'Spring', 'Autumn', 'All Season', 'Monsoon']
};