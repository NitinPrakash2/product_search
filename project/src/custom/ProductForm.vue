<template>
  <div class="w-full bg-[#0f172a] border-t-4 border-indigo-500">

    <!-- Header bar -->
    <div class="flex items-center gap-3 px-6 py-4 bg-[#1e293b] border-b border-slate-700">
      <div class="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
        <i class="pi pi-sliders-h text-indigo-400 text-base"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-100 leading-tight">Search Settings</h2>
        <p class="text-xs text-slate-400">Customize the filter sidebar</p>
      </div>
    </div>

    <!-- Body -->
    <div class="px-6 py-5 flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filters Header Label</label>
        <input
          type="text"
          :value="filtersLabel"
          placeholder="e.g. FILTERS"
          @input="onLabelInput(($event.target as HTMLInputElement).value)"
          class="w-full px-3 py-2.5 text-sm text-slate-100 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition"
        />
        <p class="text-xs text-slate-500">This text appears as the header of the filter sidebar.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { _p_TYP, _$p_TYP } from "../shared/types";

const { _p, _$p } = defineProps<{ _p: _p_TYP; _$p: _$p_TYP }>();

const STORAGE_KEY = `product_form_settings_${_$p?.data?.curr?.id ?? 'default'}`;

function loadLabel(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).filtersLabel ?? 'FILTERS';
  } catch {}
  return 'FILTERS';
}

const filtersLabel = ref(loadLabel());

function emit_update() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ filtersLabel: filtersLabel.value }));
  const updatedData = { value: { filtersLabel: filtersLabel.value } };
  window.dispatchEvent(new CustomEvent("product:form:change", { detail: updatedData }));
  _p.f.call("msg", { type: "product:form:change", _p, _$p, custom: { data: updatedData } });
}

onMounted(() => emit_update());

function onLabelInput(val: string) {
  filtersLabel.value = val;
  emit_update();
}
</script>
