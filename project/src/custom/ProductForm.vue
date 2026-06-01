<template>
  <div class="w-full bg-white border-t-4 border-indigo-500 shadow-sm">

    <!-- Header bar -->
    <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
          <i class="pi pi-shopping-bag text-indigo-600 text-base"></i>
        </div>
        <div>
          <h2 class="text-base font-bold text-gray-800 leading-tight">Manage Products</h2>
          <p class="text-xs text-gray-400">{{ products.length }} product{{ products.length !== 1 ? 's' : '' }} listed</p>
        </div>
      </div>
      <button
        @click="addProduct"
        class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150 shadow-sm"
      >
        <i class="pi pi-plus text-xs"></i>
        Add Product
      </button>
    </div>

    <!-- Body -->
    <div class="px-6 py-5 flex flex-col gap-4">

      <!-- Empty state -->
      <div v-if="products.length === 0" class="flex flex-col items-center justify-center py-14 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
        <div class="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
          <i class="pi pi-inbox text-2xl text-indigo-300"></i>
        </div>
        <p class="text-sm font-medium text-gray-500">No products yet</p>
        <p class="text-xs text-gray-400 mt-1">Click <span class="text-indigo-600 font-semibold">Add Product</span> to get started</p>
      </div>

      <!-- Product cards -->
      <div
        v-for="(item, i) in products"
        :key="i"
        class="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
      >
        <!-- Card header -->
        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
              {{ i + 1 }}
            </span>
            <span class="text-sm font-semibold text-gray-700">
              {{ item.title || 'Untitled Product' }}
            </span>
          </div>
          <button
            @click="deleteProduct(i)"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
            title="Delete product"
          >
            <i class="pi pi-trash text-xs"></i>
          </button>
        </div>

        <!-- Card fields -->
        <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- Product Name -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</label>
            <div class="relative">
              <i class="pi pi-tag absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none"></i>
              <input
                type="text"
                :value="item.title"
                placeholder="e.g. Classic T-Shirt"
                @input="update(i, 'title', ($event.target as HTMLInputElement).value)"
                class="w-full pl-8 pr-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300 transition"
              />
            </div>
          </div>

          <!-- Price -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">₹</span>
              <input
                type="number"
                :value="item.price"
                placeholder="0.00"
                min="0"
                @input="update(i, 'price', ($event.target as HTMLInputElement).value)"
                class="w-full pl-7 pr-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300 transition"
              />
            </div>
          </div>

          <!-- Image URL — full width -->
          <div class="flex flex-col gap-1.5 md:col-span-2">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Image URL</label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <i class="pi pi-image absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none"></i>
                <input
                  type="url"
                  :value="item.image"
                  placeholder="https://example.com/image.jpg"
                  @input="update(i, 'image', ($event.target as HTMLInputElement).value)"
                  class="w-full pl-8 pr-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300 transition"
                />
              </div>
              <!-- Image preview thumbnail -->
              <div class="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  v-if="item.image"
                  :src="item.image"
                  class="w-full h-full object-cover"
                  @error="($event.target as HTMLImageElement).style.display='none'"
                />
                <i v-else class="pi pi-image text-gray-300 text-sm"></i>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Bottom add button (when list non-empty) -->
      <button
        v-if="products.length > 0"
        @click="addProduct"
        class="w-full py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-150"
      >
        <i class="pi pi-plus text-xs"></i>
        Add Another Product
      </button>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { _p_TYP, _$p_TYP } from "../shared/types";

console.log("Product Form Loaded");

const { _p, _$p } = defineProps<{ _p: _p_TYP; _$p: _$p_TYP }>();

type Product = { title: string; price: string; image: string };

const STORAGE_KEY = `product_form_${_$p?.data?.curr?.id ?? 'default'}`;

function load(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  // fall back to data passed in
  const raw: any[] = _$p?.data?.curr?.data?.value?.l ?? [];
  return raw.map((x: any) => ({ title: x.title ?? '', price: x.price ?? '', image: x.image ?? '' }));
}

function save(list: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const products = ref<Product[]>(load());

function emit_update() {
  save(products.value);
  const updatedData = { value: { l: products.value.map((p) => ({ ...p })) } };
  console.log("Product Updated", updatedData);
  window.dispatchEvent(new CustomEvent("product:form:change", { detail: updatedData }));
  _p.f.call("msg", {
    type: "product:form:change",
    _p,
    _$p,
    custom: { data: updatedData },
  });
}

// on mount: replay saved products into the list immediately
import { onMounted } from 'vue';
onMounted(() => {
  if (products.value.length > 0) emit_update();
});

function addProduct() {
  console.log("Product Added");
  products.value.push({ title: "", price: "", image: "" });
  emit_update();
}

function deleteProduct(i: number) {
  console.log("Product Deleted");
  products.value.splice(i, 1);
  emit_update();
}

function update(i: number, field: keyof Product, val: string) {
  products.value[i][field] = val;
  emit_update();
}
</script>
